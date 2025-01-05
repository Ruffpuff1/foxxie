import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { StringExtensions } from '#lib/Container/Utility/Extensions/StringExtensions';
import { LanguageKeys } from '#lib/I18n';
import { MessageOptions } from '#utils/Discord/Models/MessageOptions';
import { Timespan } from '#utils/Timespan';
import { resolveClientColor, resolveEmbedField } from '#utils/util';
import { chunk } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { EmbedBuilder, TimestampStyles, bold, time } from 'discord.js';
import { ContextModel } from '../Structures/Models/ContextModel';

export class TrackBuilders {
    public async track(context: ContextModel, searchValue: string): Promise<MessageOptions> {
        const trackSearch = await this._trackService.searchTrack(
            context.user,
            searchValue,
            context.contextUser.lastFm.username!,
            null,
            false,
            context.user.id
        );
        if (!trackSearch.track) {
            return new MessageOptions(trackSearch.response);
        }

        const spotifyTrack = await this._spotifyService.getOrStoreTrack(trackSearch.track);

        const embed = new EmbedBuilder() //
            .setColor(resolveClientColor(context.guild, context.member?.displayColor))
            .setAuthor({
                iconURL: context.user.displayAvatarURL(),
                name: `Info about ${trackSearch.track.artistName} - ${spotifyTrack?.name || trackSearch.track.trackName}`,
                url: trackSearch.track.trackUrl
            });

        if (trackSearch.track.albumCoverUrl) embed.setThumbnail(trackSearch.track.albumCoverUrl);

        const leftStats = new List();
        const rightStats = new List();
        const footer = new List();

        leftStats.push(
            context.t(LanguageKeys.Commands.Fun.LastFmArtistListeners, {
                count: isNaN(trackSearch.track.totalListeners) ? 0 : trackSearch.track.totalListeners
            })
        );
        leftStats.push(
            `${bold(
                context.t(LanguageKeys.Globals.NumberFormat, {
                    value: isNaN(trackSearch.track.totalPlaycount) ? 0 : trackSearch.track.totalPlaycount
                })
            )} global plays`
        );
        leftStats.push(context.t(LanguageKeys.Commands.Fun.LastFmArtistPlaysByYou, { count: trackSearch.track.userPlaycount }));

        const duration = trackSearch.track.duration || spotifyTrack?.durationMs || 0;
        if (duration > 0) {
            const timespan = Timespan.FromMilliseconds(duration);

            rightStats.push(`${bold(timespan.formatShort())} duration`);

            if (trackSearch.track.userPlaycount > 1) {
                const listeningTime = await this._timeService.getPlayTimeForTrackWithPlaycount(
                    trackSearch.track.artistName,
                    trackSearch.track.trackName,
                    trackSearch.track.userPlaycount
                );

                leftStats.push(`${bold(listeningTime)} spent listening`);
            }
        }

        if (spotifyTrack !== null && spotifyTrack.spotifyId) {
            const pitch = StringExtensions.KeyIntToPitchString(spotifyTrack.key);

            if (pitch) rightStats.push(`${bold(pitch)} key`);

            if (spotifyTrack.tempo) {
                rightStats.push(`${bold(spotifyTrack.tempo.toFixed(1))} bpm`);
            }

            if (
                spotifyTrack.danceability ||
                spotifyTrack.energy ||
                spotifyTrack.instrumentalness ||
                spotifyTrack.acousticness ||
                spotifyTrack.speechiness ||
                spotifyTrack.liveness ||
                spotifyTrack.valence
            ) {
                const danceability = Math.round(spotifyTrack.danceability * 100);
                const energetic = Math.round(spotifyTrack.energy * 100);
                const instrumental = Math.round(spotifyTrack.instrumentalness * 100);
                const acoustic = Math.round(spotifyTrack.acousticness * 100);
                const speechful = Math.round(spotifyTrack.speechiness * 100);
                const liveness = Math.round(spotifyTrack.liveness * 100);
                const valence = Math.round(spotifyTrack.valence * 100);

                const stats = [];

                if (danceability) stats.push(`${danceability}% danceable`);
                if (energetic) stats.push(`${energetic}% energetic`);
                if (acoustic) stats.push(`${acoustic}% acoustic`);
                if (instrumental) stats.push(`${instrumental}% instrumental`);
                if (speechful) stats.push(`${speechful}% speechful`);
                if (liveness) stats.push(`${liveness}% liveness`);
                if (valence) stats.push(`${valence}% valence (musical positiveness)`);

                if (stats.length > 2) {
                    if (stats.length > 4) {
                        footer.push(
                            chunk(stats, 4)
                                .map(arr => arr.join(' - '))
                                .join('\n')
                        );
                    } else {
                        footer.push(stats.join(' - '));
                    }
                }
            }
        }

        if (context.contextUser.lastFm.playcount && trackSearch.track.userPlaycount >= 10) {
            footer.push(
                `${((trackSearch.track.userPlaycount / context.contextUser.lastFm.playcount) * 100).toFixed(
                    2
                )}% of all your scrobbles are on this track`
            );
        }

        if (trackSearch.track.userPlaycount) {
            const firstPlay = await this._playService.getTrackFirstPlayDate(
                context.contextUser.id,
                trackSearch.track.trackName,
                trackSearch.track.artistName
            );

            if (firstPlay) {
                embed.setDescription(`Discovered on ${time(firstPlay, TimestampStyles.LongDate)}`);
            }
        }

        embed.addFields(resolveEmbedField('Statistics', leftStats.stringify(), true));

        if (rightStats.length) {
            embed.addFields(resolveEmbedField('Info', rightStats.stringify(), true));
        }

        if (trackSearch.track.description) {
            embed.addFields(resolveEmbedField('Summary', trackSearch.track.description));
        }

        if (footer.length) embed.setFooter({ text: footer.stringify() });

        return new MessageOptions(embed);
    }

    private get _playService() {
        return container.apis.lastFm.playService;
    }

    private get _spotifyService() {
        return container.apis.spotify;
    }

    private get _timeService() {
        return container.apis.lastFm.timeService;
    }

    private get _trackService() {
        return container.apis.lastFm.trackService;
    }
}
