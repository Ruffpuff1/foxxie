import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { LastFmArtistGetInfoResult, buildArtistDisplay, fetchArtist, searchArtist } from '#utils/API/lastfm';
import { sendLoadingMessage } from '#utils/Discord';
import { floatPromise, resolveClientColor } from '#utils/util';
import { cast, toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['fm'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    detailedDescription: LanguageKeys.Commands.Fun.AnimalcrossingDetailedDescription,
    subcommands: [{ name: 'artist', default: true, messageRun: 'messageRunArtist' }]
})
export class UserCommand extends FoxxieCommand {
    private static artist = Args.make<string>((parameter, { argument }) => {
        const lower = parameter?.toLowerCase();
        if (!lower) return Args.error({ argument, parameter, identifier: 'noArtistProvided' });
        return Args.ok(lower);
    });

    public async messageRunArtist(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const artist = await args.rest(UserCommand.artist);

        const loading = await sendLoadingMessage(message);
        const artistData = await fetchArtist(artist);

        if (Reflect.has(artistData, 'error')) {
            const searchResults = await searchArtist(artist);

            const options = searchResults.results.artistmatches.artist.map(
                art =>
                    new StringSelectMenuOptionBuilder({
                        label: toTitleCase(art.name),
                        value: art.name,
                        default: false
                    })
            );

            if (!options.length) this.error('no search results');

            const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>() //
                .addComponents(new StringSelectMenuBuilder().setCustomId(`lastfm|artist|${message.id}`).setOptions(options));

            await floatPromise(loading.delete());

            await message.channel.send({
                content: args.t(LanguageKeys.Commands.Fun.AnimalcrossingNoVillager, { villager: artist }),
                components: [actionRow]
            });

            return;
        }

        const artistEntity = await this.container.apis.spotify.getOrStoreArtist(cast<LastFmArtistGetInfoResult>(artistData));
        const artistBody = cast<LastFmArtistGetInfoResult>(artistData).artist;

        const display = await buildArtistDisplay(
            artistBody,
            artistEntity,
            args.t,
            resolveClientColor(message.guild, message.member.displayColor),
            message.author.id,
            message.guildId
        );

        await loading.delete();

        await display.run(message);
    }
}
