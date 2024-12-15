import { StringExtensions } from '#lib/Container/Utility/Extensions/StringExtensions';
import { LanguageKeys } from '#lib/I18n';
import { resolveClientColor, resolveEmbedField } from '#utils/util';
import { hours, minutes } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { MessageOptions } from '@sapphire/plugin-editable-commands';
import { DurationFormatter } from '@sapphire/time-utilities';
import { EmbedBuilder, TimestampStyles, bold, italic, time } from 'discord.js';
import _ from 'lodash';
import { ArtistsService } from '../Services/ArtistsService';
import { PlayService } from '../Services/PlayService';
import { UpdateService } from '../Services/UpdateService';
import { WhoKnowsArtistService } from '../Services/WhoKnowsArtistService';
import { WhoKnowsPlayService } from '../Services/WhoKnowsPlayService';
import { WhoKnowsService } from '../Services/WhoKnowsService';
import { ContextModel } from '../Structures/Models/ContextModel';
import { WhoKnowsSettings } from '../Structures/WhoKnowsSettings';

export class ArtistBuilders {
    public artistsService = new ArtistsService();

    public playService = new PlayService();

    public updateService = new UpdateService();

    public whoKnowsArtistService = new WhoKnowsArtistService();

    public whoKnowsPlayService = new WhoKnowsPlayService();

    public async artist(context: ContextModel, searchValue: string): Promise<MessageOptions> {
        const userEntity = await container.db.users.ensure(context.user.id);
        const artistSearch = await this.artistsService.searchArtist(
            context.user,
            searchValue,
            userEntity.lastFm.username!,
            null,
            null,
            undefined,
            context.user.id
        );

        if (!artistSearch.artist) {
            return { content: artistSearch.response || 'An error occurred while searching for that artist, please try again.' };
        }

        const member = context.guild ? context.guild.members.cache.get(context.user.id)! : null;

        const color = resolveClientColor(context.guild, member?.displayColor);
        const titles = context.t(LanguageKeys.Commands.Fun.LastFmTitles);

        const spotifyArtistTask = container.apis.spotify.getOrStoreArtist(artistSearch.artist);
        const fullArtist = await spotifyArtistTask;

        const weekPlaycount = await this.playService.getArtistPlaycountForTimePeriod(userEntity.id, fullArtist.name);

        const embed = new EmbedBuilder() //
            .setColor(color)
            .setThumbnail(fullArtist.spotifyImageUrl || null)
            .setAuthor({
                name: fullArtist.name,
                iconURL: fullArtist.spotifyImageUrl,
                url: `https://last.fm/music/${encodeURIComponent(fullArtist.name)}`
            });

        const footer: string[] = [];
        if (artistSearch.artist.userPlaycount)
            footer.push(
                `${((artistSearch.artist.userPlaycount / userEntity.lastFm.playcount) * 100).toFixed(
                    2
                )} % of all your scrobbles are on this artist`
            );

        const serverStats: string[] = [];

        if (context.guild) {
            const guildUsers = await container.apis.lastFm.getGuildMembersWithLastFmUsername(context.guild.id);
            const onlySelf = guildUsers.length === 1 && guildUsers[0].id === context.user.id;

            const usersWithArtist = await this.whoKnowsArtistService.getIndexedUsersForArtist(
                context.guild.id,
                guildUsers,
                artistSearch.artist.artistName
            );

            if (usersWithArtist.length && !onlySelf) {
                const serverListeners = usersWithArtist.length;
                const serverPlaycount = usersWithArtist.reduce((acc, a) => (acc += a.playcount), 0);
                const avgServerPlaycount = Math.floor(serverPlaycount / serverListeners);
                const serverPlaycountLastWeek = await this.playService.getWeekArtistPlaycountForGuildAsync(
                    context.guild.id,
                    artistSearch.artist.artistName
                );
                const onlySelfWithArtist = usersWithArtist.length === 1 && usersWithArtist[0].userId === context.user.id;

                if (serverListeners)
                    serverStats.push(
                        `${context.t(LanguageKeys.Commands.Fun.LastFmArtistListeners, { count: serverListeners })}${
                            onlySelfWithArtist ? italic(' (only you)') : ''
                        }`
                    );
                if (serverPlaycount)
                    serverStats.push(context.t(LanguageKeys.Commands.Fun.LastFmPlayPlays, { count: serverPlaycount }));
                if (avgServerPlaycount && avgServerPlaycount !== serverPlaycount)
                    serverStats.push(`${bold(avgServerPlaycount.toLocaleString())} avg plays`);
                if (serverPlaycountLastWeek)
                    serverStats.push(`${bold(serverPlaycountLastWeek.toLocaleString())} plays last week`);
            }

            const guildAlsoPlaying = this.whoKnowsPlayService.guildAlsoPlayingArtist(
                context.user.id,
                guildUsers,
                artistSearch.artist.artistName
            );

            if (guildAlsoPlaying !== null) {
                footer.push(guildAlsoPlaying);
            }
        }

        if (fullArtist.tags.length) {
            footer.push(context.t(LanguageKeys.Globals.And, { value: fullArtist.tags.map(t => t.name) }));
        }

        if (fullArtist.lastFmDate.getTime() < Date.now() - minutes(2))
            footer.push(`Last updated ${new DurationFormatter().format(Date.now() - fullArtist.lastFmDate.getTime(), 1)} ago`);

        let firstListenInfo: string | null = null;
        if (artistSearch.artist.userPlaycount! > 0) {
            const firstPlay = await this.playService.getArtistFirstPlayDate(context.user.id, artistSearch.artist.artistName);
            if (firstPlay !== null) {
                firstListenInfo = `First discovered on ${time(firstPlay, TimestampStyles.LongDate)}`;
            }
        }

        const artistInfo: string[] = [];

        if (fullArtist.type) {
            if (fullArtist.gender) {
                artistInfo.push(`${bold(fullArtist.type)} - ${bold(fullArtist.gender)}`);
            } else {
                artistInfo.push(fullArtist.type);
            }
        }

        if (fullArtist.disambiguation) {
            if (fullArtist.location) {
                artistInfo.push(`${bold(fullArtist.disambiguation)} from ${bold(fullArtist.location)}`);
            } else {
                artistInfo.push(bold(fullArtist.disambiguation));
            }
        } else if (fullArtist.location) artistInfo.push(`From ${bold(fullArtist.location)}`);

        if (fullArtist.startDate && !fullArtist.endDate) {
            const fixedData = new Date(fullArtist.startDate.getTime() + hours(7));

            if (container.apis.spotify.musicBrainz.personTypes.includes(fullArtist.type)) {
                artistInfo.push(
                    `Born: ${time(fixedData, TimestampStyles.LongDate)} (${time(fixedData, TimestampStyles.RelativeTime)})`
                );
            } else {
                artistInfo.push(
                    `Started: ${time(fixedData, TimestampStyles.LongDate)} (${time(fixedData, TimestampStyles.RelativeTime)})`
                );
            }
        }

        if (fullArtist.startDate && fullArtist.endDate) {
            const fixedStartData = new Date(fullArtist.startDate.getTime() + hours(7));
            const fixedEndData = new Date(fullArtist.endDate.getTime() + hours(7));

            if (container.apis.spotify.musicBrainz.personTypes.includes(fullArtist.type)) {
                artistInfo.push(
                    `Born: ${time(fixedStartData, TimestampStyles.LongDate)} (${time(
                        fixedStartData,
                        TimestampStyles.RelativeTime
                    )})`
                );
                artistInfo.push(
                    `Died: ${time(fixedEndData, TimestampStyles.LongDate)} (${time(fixedEndData, TimestampStyles.RelativeTime)})`
                );
            } else {
                artistInfo.push(
                    `Started: ${time(fixedStartData, TimestampStyles.LongDate)} (${time(
                        fixedStartData,
                        TimestampStyles.RelativeTime
                    )})`
                );
                artistInfo.push(
                    `Ended: ${time(fixedEndData, TimestampStyles.LongDate)} (${time(fixedEndData, TimestampStyles.RelativeTime)})`
                );
            }
        }

        if (firstListenInfo !== null) artistInfo.push(firstListenInfo);

        if (artistInfo.length) embed.setDescription(artistInfo.join('\n'));
        if (serverStats.length) embed.addFields(resolveEmbedField('• Server Stats', serverStats.join('\n'), true));

        const globalStats = [
            context.t(LanguageKeys.Commands.Fun.LastFmArtistListeners, { count: artistSearch.artist?.totalListeners }),
            context.t(LanguageKeys.Commands.Fun.LastFmPlayPlays, { count: artistSearch.artist?.totalPlaycount })
        ];

        if (artistSearch.artist?.userPlaycount) {
            globalStats.push(
                context.t(LanguageKeys.Commands.Fun.LastFmArtistPlaysByYou, { count: artistSearch.artist.userPlaycount })
            );
            if (weekPlaycount)
                globalStats.push(context.t(LanguageKeys.Commands.Fun.LastFmArtistPlaysByYouLastWeek, { count: weekPlaycount }));
            await this.updateService.correctUserArtistPlaycount(
                userEntity.id,
                fullArtist.name,
                artistSearch.artist.userPlaycount
            );
        }

        if (globalStats.length) embed.addFields(resolveEmbedField(titles.lastFmStats, globalStats.join('\n'), true));

        if (footer.length) embed.setFooter({ text: footer.join('\n') });

        const formattedDescription = container.apis.lastFm.formatArtistDescription(fullArtist.lastFmDescription);
        if (formattedDescription && formattedDescription !== '__')
            embed.addFields(resolveEmbedField(titles.about, formattedDescription));

        if (context.contextUser?.discogs.releases.length) {
            const artistCollection = context.contextUser?.discogs.releases.filter(
                w =>
                    w.release.artist.toLowerCase().startsWith(artistSearch.artist!.artistName.toLowerCase()) ||
                    artistSearch.artist!.artistName.toLowerCase().startsWith(w.release.artist.toLowerCase())
            );

            if (artistCollection.length) {
                const artistCollectionDescription: string[] = [];
                for (const album of artistCollection.slice(0, 8)) {
                    artistCollectionDescription.push(StringExtensions.UserDiscogsWithAlbumName(album));
                }

                embed.addFields(resolveEmbedField('• Your Discogs collection', artistCollectionDescription.join('\n')));
            }
        }

        return { embeds: [embed], content: null };
    }

    public async globalWhoKnowsArtist(context: ContextModel, settings: WhoKnowsSettings): Promise<MessageOptions> {
        const artistSearch = await this.artistsService.searchArtist(
            context.user,
            settings.newSearchValue,
            context.contextUser!.lastFm.username!,
            undefined,
            undefined,
            undefined,
            context.contextUser!.id
        );
        if (artistSearch.artist === null) return { content: artistSearch.response! };

        const artist = await container.apis.spotify.getOrStoreArtist(artistSearch.artist);

        const imgUrl = artist.spotifyImageUrl;

        const usersWithArtist = await this.whoKnowsArtistService.getGlobalUsersForArtists(
            context.guild,
            artistSearch.artist.artistName.toLowerCase()
        );

        const filteredUsersWithArtist = usersWithArtist;

        let serverUsers = WhoKnowsService.WhoKnowsListToString(filteredUsersWithArtist, context.contextUser!.id);
        if (!serverUsers.length) {
            serverUsers = 'Nobody thats uses me has listened to this artist.';
        }

        const footer = [];

        if (artistSearch.isRandom) {
            footer.push(`Artist #${artistSearch.randomArtistPosition} (${artistSearch.randomArtistPlaycount} plays)`);
        }

        footer.push(`Global WhoKnows artist requesteed by ${context.user.displayName}`);

        if (filteredUsersWithArtist.length > 1) {
            const globalListeners = filteredUsersWithArtist.length;
            const globalPlaycount = _.sumBy(filteredUsersWithArtist, a => a.playcount);
            const avgPlaycount = Math.floor(globalPlaycount / globalListeners);

            footer.push(`${globalListeners} listeners - ${globalPlaycount} total plays - ${avgPlaycount} avg plays`);
        }

        const embed = new EmbedBuilder()
            .setDescription(serverUsers)
            .setThumbnail(imgUrl)
            .setColor(resolveClientColor(context.guild, context.guild.members.cache.get(context.user.id)?.displayColor))
            .setAuthor({
                name: `${artistSearch.artist.artistName} Globally`,
                iconURL: imgUrl,
                url: artistSearch.artist.artistUrl
            })
            .setFooter({ text: footer.join('\n') });

        return { embeds: [embed], content: null };
    }
}
