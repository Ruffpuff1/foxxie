import { deserializeEntry, Song } from '#lib/audio';
import { LanguageKeys } from '#lib/i18n';
import { AudioCommand } from '#lib/structures';
import { Events, GuildMessage } from '#lib/types';
import { getAudio } from '#utils/Discord';
import { sendLoadingMessage } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import type { MessageCommandContext } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<AudioCommand.Options>({
    aliases: ['pl'],
    options: ['playlist', 'queue'],
    description: LanguageKeys.Commands.Audio.PlayDescription,
    detailedDescription: LanguageKeys.Commands.Audio.PlayDetailedDescription
})
export class UserCommand extends AudioCommand {
    public async messageRun(msg: GuildMessage, args: AudioCommand.Args, context: MessageCommandContext): Promise<void> {
        const audio = getAudio(msg.guild);

        if (!audio.voiceChannelId) {
            await this.join.messageRun(msg, args, context);
        }

        if (!args.finished) {
            await this.addSongs(msg, args);
            if (audio.playing) return;
        }

        const list = args.getOption('playlist', 'queue');
        if (list !== null) {
            await this.addPlaylist(msg, list);
            if (audio.playing) return;
        }

        const current = await audio.getCurrentSong();
        if (!current && await audio.count() === 0) {
            const content = args.t(LanguageKeys.Commands.Audio.PlayQueueEmpty);
            await send(msg, content);
            return;
        }

        if (audio.playing) {
            const content = args.t(LanguageKeys.Commands.Audio.PlayAlreadyPlaying);
            await send(msg, content);
            return;
        }

        if (current && audio.paused) {
            await audio.resume();
            this.container.client.emit(Events.MusicSongResumeNotify, msg);
        } else {
            await audio.setTextChannelId(msg.channel.id);
            await audio.start();
        }
    }

    private async addSongs(msg: GuildMessage, args: AudioCommand.Args): Promise<void> {
        await sendLoadingMessage(msg);

        const songs = await args.rest('song').catch(() => []);
        if (!songs.length) this.error(LanguageKeys.Commands.Audio.PlayNoSongs);

        const tracks = songs.map(track => ({ author: msg.author.id, track }));

        await this.loadSongs(msg, tracks);
    }

    private async addPlaylist(msg: GuildMessage, list: string) {
        const entry = await this.container.db.playlists.findOne({
            name: list,
            userId: msg.author.id
        });
        if (!entry) return;

        const mapped = entry.songs.map(deserializeEntry);

        await this.loadSongs(msg, mapped);
    }

    private async loadSongs(msg: GuildMessage, tracks: Song[]): Promise<void> {
        await getAudio(msg.guild).add(...tracks);

        this.client.emit(Events.MusicAddNotify, msg, tracks);
    }

    private get join(): AudioCommand {
        return this.store.get('join') as AudioCommand;
    }
}
