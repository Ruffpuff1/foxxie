import { fuzzySearchVillagers } from '#Api/Celestia/celestia';
import { ContextModel } from '#Api/LastFm/Structures/Models/ContextModel';
import { SubCommandCommand } from '#lib/Container/Utility';
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { GuildMessage } from '#lib/Types';
import { sendLoadingMessage } from '#utils/Discord';
import { floatPromise } from '#utils/util';
import { VillagerKey } from '@foxxie/celestia-api-types';
import { toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, container } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['ac', 'celestia'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    detailedDescription: LanguageKeys.Commands.Fun.AnimalcrossingDetailedDescription,
    subcommands: container.utilities.subCommands.get(SubCommandCommand.AnimalCrossing)
})
export class UserCommand extends FoxxieCommand {
    private static villager = Args.make<`${VillagerKey}`>((parameter, { argument }) => {
        const lower = parameter?.toLowerCase();
        if (!lower)
            return Args.error({ argument, parameter, identifier: LanguageKeys.Commands.Fun.AnimalcrossingNoVillagerProvided });
        return Args.ok(lower as `${VillagerKey}`);
    });

    public async messageRunVillager(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const villager = await args.pick(UserCommand.villager);

        const loading = await sendLoadingMessage(message);
        const villagerData = await this._celestiaRepository.getVillager(villager);

        if (!villagerData.success) {
            if (villagerData.message === LanguageKeys.Commands.Fun.AnimalcrossingNoVillager) {
                const fuzzy = await fuzzySearchVillagers(villager, 25);

                const options = fuzzy.map<StringSelectMenuOptionBuilder>(
                    entry =>
                        new StringSelectMenuOptionBuilder({
                            label: toTitleCase(entry.key),
                            value: entry.key,
                            default: false
                        })
                );

                const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>() //
                    .addComponents(
                        new StringSelectMenuBuilder().setCustomId(`animalcrossing|villager|${message.id}`).setOptions(options)
                    );

                await floatPromise(loading.delete());

                await message.channel.send({
                    content: args.t(LanguageKeys.Commands.Fun.AnimalcrossingNoVillager, { villager }),
                    components: [actionRow]
                });

                return;
            }

            this.error('unknown internal error');
        }

        const display = this._villagerBuilders.villager(
            villagerData.content,
            new ContextModel(
                {
                    t: args.t,
                    user: message.author,
                    channel: message.channel,
                    guild: message.guild
                },
                null!
            )
        );

        await display.run(message);
        await floatPromise(loading.delete());
    }

    private get _celestiaRepository() {
        return this.container.apis.celestia.celestiaRepository;
    }

    private get _villagerBuilders() {
        return this.container.apis.celestia.villagerBuilders;
    }
}
