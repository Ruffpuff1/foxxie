import { AutocompleteCommand, Command } from '@sapphire/framework';
import { RegisterChatInputCommand } from '#utils/decorators';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { envParseBoolean } from '#lib/env';
import type { VillagersEnum } from '@ruffpuff/celestia';
import { buildVillagerDisplay, fetchVillager, fetchVillagers } from '#utils/APIs';
import { seconds } from '@ruffpuff/utilities';
import { setTimeout as sleep } from 'node:timers/promises';
import { FuzzySearch } from '#utils/FuzzySearch';
import { Collection } from 'discord.js';

@RegisterChatInputCommand(
    CommandName.AnimalCrossing,
    builder =>
        builder //
            .setDescription('fetch animal crossing data from celestia')
            .addSubcommand(command =>
                command //
                    .setName('villager')
                    .setDescription('fetch data about an animal crossing villager')
                    .addStringOption(option =>
                        option //
                            .setName('villager')
                            .setDescription('the villager to search for')
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
    private villagers: VillagersEnum[] = [];

    public chatInputRun(...[interaction, c, args]: ChatInputArgs<CommandName.AnimalCrossing>) {
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

        const fuzz = new FuzzySearch(new Collection(this.villagers.map(k => [k, { key: k }])), ['key']);
        const result = fuzz.runFuzzy(opt.value as string);

        return interaction.respond(result.slice(0, 20).map(r => ({ name: r.key, value: r.key })));
    }

    public async onLoad() {
        await sleep(seconds(10));
        const data = await fetchVillagers();

        for (const key of data.data.getVillagers) {
            this.villagers.push(key);
        }

        console.log(this);
    }

    private async villager(...[interaction, , args]: Required<ChatInputArgs<CommandName.AnimalCrossing>>) {
        await interaction.deferReply();
        const { villager } = args.villager;

        const villagerData = await fetchVillager(villager as VillagersEnum);
        if (!villagerData) return null;

        const display = buildVillagerDisplay(villagerData, args.t);

        await display.run(interaction, interaction.user);
        return null;
    }
}
