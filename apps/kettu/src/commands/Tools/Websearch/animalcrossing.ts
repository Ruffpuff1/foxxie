import { AutocompleteCommand, Command } from '@sapphire/framework';
import { RegisterChatInputCommand } from '#utils/decorators';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { envParseBoolean } from '#lib/env';
import type { VillagersEnum } from '@ruffpuff/celestia';
import { buildVillagerDisplay, fetchVillager, fuzzySearchVillagers } from '#utils/APIs';
import { toTitleCase } from '@ruffpuff/utilities';
import { enUS } from '#utils/util';
import { LanguageKeys } from '#lib/i18n';
import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';

@RegisterChatInputCommand(
    CommandName.AnimalCrossing,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.Websearch.AnimalcrossingDescription))
            .addSubcommand(command =>
                command //
                    .setName('villager')
                    .setDescription(enUS(LanguageKeys.Commands.Websearch.AnimalcrossingDescriptionVillager))
                    .addStringOption(option =>
                        option //
                            .setName('villager')
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.AnimalcrossingOptionVillager))
                            .setAutocomplete(true)
                            .setRequired(true)
                    )
            ),
    ['949309221441273866'],
    {
        enabled: envParseBoolean('CELESTIA_ENABLED')
    }
)
export class UserCommand extends Command {
    private villagers!: VillagersEnum[];

    public chatInputRun(...[interaction, c, args]: ChatInputArgs<CommandName.AnimalCrossing>): Promise<any> {
        const subcommand = interaction.options.getSubcommand(true);

        switch (subcommand) {
            case 'villager':
                return this.villager(interaction, c, args!);
            default:
                throw new Error(`Subcommand "${subcommand}" not supported.`);
        }
    }

    public async autocompleteRun(...[interaction]: Parameters<AutocompleteCommand['autocompleteRun']>) {
        const opt = interaction.options.getFocused(true);
        const data = await fuzzySearchVillagers(opt.value as string, 20, this.villagers);
        return interaction.respond(data.map(r => ({ name: r.key, value: r.key })));
    }

    private async villager(...[interaction, , args]: Required<ChatInputArgs<CommandName.AnimalCrossing>>) {
        await interaction.deferReply();
        const { villager } = args.villager;

        const villagerData = await fetchVillager(villager as VillagersEnum);

        if (!villagerData) {
            const fuzz = await fuzzySearchVillagers(villager, 25);
            const opts = fuzz.map<MessageSelectOptionData>(entry => ({
                label: toTitleCase(entry.key),
                value: entry.key
            }));

            const actionRow = new MessageActionRow() //
                .setComponents(
                    new MessageSelectMenu() //
                        .setCustomId(`animalcrossing|villager`)
                        .setOptions(opts)
                );

            await interaction.deleteReply();
            return interaction.followUp({
                content: args.t(LanguageKeys.Commands.Websearch.AnimalcrossingNoVillager, { villager }),
                components: [actionRow],
                ephemeral: true
            });
        }

        const display = buildVillagerDisplay(villagerData, args.t, interaction.guild?.me?.displayColor);

        await display.run(interaction, interaction.user);
        return null;
    }
}
