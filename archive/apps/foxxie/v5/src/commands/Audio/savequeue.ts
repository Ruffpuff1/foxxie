import { LanguageKeys } from '#lib/i18n';
import { AudioCommand } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { RequireQueueNotEmpty, RequireSameVoiceChannel } from '#utils/decorators';
import { getAudio } from '#utils/Discord';
import { sendLoadingMessage } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<AudioCommand.Options>({
    aliases: ['save-queue', 'sq'],
    generateDashLessAliases: false,
    description: LanguageKeys.Commands.Audio.SavequeueDescription,
    detailedDescription: LanguageKeys.Commands.Audio.SavequeueDetailedDescription,
    subCommands: ['create', { input: 'list', default: true }]
})
export class UserCommand extends AudioCommand {
    @RequireQueueNotEmpty()
    @RequireSameVoiceChannel()
    public async create(msg: GuildMessage, args: AudioCommand.Args): Promise<void> {
        const name = await args.pick('string', { maximum: 20 });
        const { playlists } = this.container.db;

        const existing = await playlists.find({ userId: msg.author.id });
        const found = existing.find(playlist => playlist.name === name);

        if (found)
            this.error(LanguageKeys.Commands.Audio.SavequeueAlreadyExists, {
                name
            });

        const audio = getAudio(msg.guild);
        const [hash, songs] = await audio.createPlaylist();

        const created = playlists.create({
            userId: msg.author.id,
            name,
            id: hash,
            songs
        });
        await created.save();

        await send(msg, args.t(LanguageKeys.Commands.Audio.SavequeueSuccess, { name }));
    }

    public async list(msg: GuildMessage, args: AudioCommand.Args): Promise<void> {
        await sendLoadingMessage(msg);
        const { playlists } = this.container.db;

        const existing = await playlists.find({ userId: msg.author.id });
        if (!existing.length) this.error(LanguageKeys.Commands.Audio.SavequeueListNone);

        const description = existing.map(playlist => `\`${playlist.name}\``).join(', ');

        const embed = new MessageEmbed()
            .setColor(args.color)
            .setAuthor({
                name: `${msg.author.tag}'s playlists (${existing.length})`
            })
            .setDescription(description);

        await send(msg, { embeds: [embed] });
    }
}
