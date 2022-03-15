import { AutocompleteCommand, Command } from '@sapphire/framework';
import { RegisterChatInputCommand } from '#utils/decorators';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { envParseBoolean } from '#lib/env';
import { buildStardewVillagerDisplay, fetchStardewVillager, fuzzySearchStardewVillagers } from '#utils/APIs';
import type { VillagersEnum } from '@foxxie/stardrop';
import { enUS } from '#utils/util';
import { LanguageKeys } from '#lib/i18n';

@RegisterChatInputCommand(
    CommandName.StardewValley,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.Websearch.StardewvalleyDescription))
            .addSubcommand(command =>
                command //
                    .setName('character')
                    .setDescription('stardew character')
                    .addStringOption(option =>
                        option //
                            .setName('villager')
                            .setDescription('villager')
                            .setAutocomplete(true)
                            .setRequired(true)
                    )
            ),
    ['953151326844518430'],
    {
        enabled: envParseBoolean('STARDROP_ENABLED', true)
    }
)
export class UserCommand extends Command {
    public chatInputRun(...[interaction, c, args]: ChatInputArgs<CommandName.StardewValley>): Promise<any> {
        const subcommand = interaction.options.getSubcommand(true);

        switch (subcommand) {
            case 'character':
                return this.character(interaction, c, args!);
            default:
                throw new Error(`Subcommand "${subcommand}" not supported.`);
        }
    }

    public async autocompleteRun(...[interaction]: Parameters<AutocompleteCommand['autocompleteRun']>) {
        const opt = interaction.options.getFocused(true);
        const data = await fuzzySearchStardewVillagers(opt.value as string);

        return interaction.respond(data.map(r => ({ name: r.key, value: r.key })));
    }

    private async character(...[interaction, , args]: Required<ChatInputArgs<CommandName.StardewValley>>) {
        await interaction.deferReply();
        const { villager } = args.character;

        const villagerData = await fetchStardewVillager(villager as VillagersEnum);

        const display = buildStardewVillagerDisplay(villagerData!, args.t);

        return display.run(interaction, interaction.user);
    }
}
