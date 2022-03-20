import { AutocompleteCommand, Command } from '@sapphire/framework';
import { RegisterChatInputCommand } from '#utils/decorators';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { buildStardewVillagerDisplay, fetchStardewVillager, fuzzySearchStardewVillagers } from '#utils/APIs';
import type { VillagersEnum } from '@foxxie/stardrop';
import { enUS } from '#utils/util';
import { LanguageKeys } from '#lib/i18n';
import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { toTitleCase } from '@ruffpuff/utilities';
import { envParse } from '#root/config';

@RegisterChatInputCommand(
    CommandName.StardewValley,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.Websearch.StardewvalleyDescription))
            .addSubcommand(command =>
                command //
                    .setName('character')
                    .setDescription(enUS(LanguageKeys.Commands.Websearch.StardewvalleyDescriptionCharacter))
                    .addStringOption(option =>
                        option //
                            .setName('villager')
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.StardewvalleyOptionVillager))
                            .setAutocomplete(true)
                            .setRequired(true)
                    )
            ),
    ['953151326844518430'],
    {
        enabled: envParse.boolean('STARDROP_ENABLED')
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
        if (!villagerData) {
            const fuzz = await fuzzySearchStardewVillagers(villager, 25);
            const opts = fuzz.map<MessageSelectOptionData>(entry => ({
                label: toTitleCase(entry.key),
                value: entry.key
            }));

            const actionRow = new MessageActionRow() //
                .setComponents(
                    new MessageSelectMenu() //
                        .setCustomId(`stardewvalley|villager`)
                        .setOptions(opts)
                );

            await interaction.deleteReply();
            return interaction.followUp({
                content: args.t(LanguageKeys.Commands.Websearch.StardewvalleyNoVillager, { villager }),
                components: [actionRow],
                ephemeral: true
            });
        }

        const display = buildStardewVillagerDisplay(villagerData!, args.t);

        return display.run(interaction, interaction.user);
    }
}
