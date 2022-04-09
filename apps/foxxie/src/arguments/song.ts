import { Argument, ArgumentContext, Result, UserError } from '@sapphire/framework';
import type { GuildMessage } from 'lib/types/Discord';
import { parseURL, SpotifyPlaylistRegExp, SpotifySongRegExp } from '@ruffpuff/utilities';
import { LoadType } from '@skyra/audio';
import { fetchT } from '@sapphire/plugin-i18next';
import { extractSongsFromPlaylist, getSongData } from '#utils/API';
import { LanguageKeys } from '#lib/i18n';

export class UserArgument extends Argument<string[]> {
    public async run(param: string, context: ArgumentContext): Promise<Result<string[], UserError>> {
        const message = context.message as GuildMessage;
        let tracks: string[] | null;

        if (SpotifyPlaylistRegExp.test(param) || SpotifySongRegExp.test(param)) tracks = await this.handleSpotify(message, param);
        else tracks = await this.fetchURL(message, param) ?? await this.handleYouTube(message, param);

        if (tracks === null || tracks.length === 0) {
            return this.error({
                parameter: param,
                context,
                identifier: LanguageKeys.Arguments.Song
            });
        }

        return this.ok(tracks);
    }

    private async handleSpotify(message: GuildMessage, param: string): Promise<string[] | null> {
        if (SpotifyPlaylistRegExp.test(param)) {
            const songs = await extractSongsFromPlaylist(param);
            const data = await Promise.all(songs.map(async song => this.handleYouTube(message, song)));
            return data.filter(a => Boolean(a)).map(ids => ids![0]);
        } else if (SpotifySongRegExp.test(param)) {
            const song = await getSongData(param);
            const data = await this.handleYouTube(message, song!);
            return data;
        }

        return [];
    }

    private handleYouTube(message: GuildMessage, arg: string): Promise<string[] | null> {
        return this.getResults(message, `ytsearch: ${arg}`);
    }

    private async fetchURL(message: GuildMessage, param: string) {
        const url = parseURL(param.replace(/^<(.+)>$/g, '$1'));
        if (url === null) return null;

        return this.getResults(message, url.href);
    }

    private async getResults(message: GuildMessage, param: string) {
        const audio = this.container.client.audio!.players.get(message.guild.id);
        try {
            const response = await audio.node.load(param);

            if (response.loadType === LoadType.NoMatches) throw (await fetchT(message.guild))(LanguageKeys.Arguments.Song);

            if (response.tracks.length === 0) return response.tracks.map(track => track.track);

            return [response.tracks[0].track];
        } catch {
            return [];
        }
    }
}
