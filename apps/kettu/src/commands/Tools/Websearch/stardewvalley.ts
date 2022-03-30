import { AutocompleteCommand, Command } from '@sapphire/framework';
import { RegisterChatInputCommand } from '@foxxie/commands';
import { CommandName, ChatInputSubcommandArgs } from '#types/Interactions';
import { buildStardewVillagerDisplay, fetchStardewVillager, fuzzySearchStardewVillagers } from '#utils/APIs';
import type { VillagersEnum } from '@foxxie/stardrop';
import { enUS, getGuildIds } from '#utils/util';
import { LanguageKeys } from '#lib/i18n';
import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { toTitleCase } from '@ruffpuff/utilities';
import { EnvParse } from '@foxxie/env';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.StardewValley)
            .setDescription(LanguageKeys.Commands.Websearch.StardewvalleyDescription)
            .subcommand(command =>
                command //
                    .setName('character')
                    .setDescription(LanguageKeys.Commands.Websearch.StardewvalleyDescriptionCharacter)
                    .addStringOption(option =>
                        option //
                            .setName('villager')
                            .setDescription(enUS(LanguageKeys.Commands.Websearch.StardewvalleyOptionVillager))
                            .setAutocomplete(true)
                            .setRequired(true)
                    )
            ),
    {
        idHints: ['953151326844518430'],
        enabled: EnvParse.boolean('STARDROP_ENABLED'),
        guildIds: getGuildIds()
    }
)
export class UserCommand extends Command {
    public async autocompleteRun(...[interaction]: Parameters<AutocompleteCommand['autocompleteRun']>) {
        const opt = interaction.options.getFocused(true);
        const data = await fuzzySearchStardewVillagers(opt.value as string);

        return interaction.respond(data.map(r => ({ name: r.key, value: r.key })));
    }

    public async character(...[interaction, , args]: Required<ChatInputSubcommandArgs<CommandName.StardewValley, 'character'>>): Promise<any> {
        await interaction.deferReply();
        console.log(args);
        const { villager } = args;

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
