import { FoxxieCommand } from '../../lib/structures/commands';
import { ApplyOptions } from '@sapphire/decorators';
import { QueryType } from 'discord-player';
import { sendLoading } from '../../lib/util';
import { languageKeys } from '../../lib/i18n';
import type { GuildMessage } from '../../lib/types/Discord';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['pl'],
    description: languageKeys.commands.audio.playDescription,
    detailedDescription: languageKeys.commands.audio.playExtendedUsage,
    runIn: [CommandOptionsRunTypeEnum.GuildAny],
    audio: true
})
export default class extends FoxxieCommand {

    public async messageRun(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const { audio } = this.container.client;
        if (!audio) return;
        const query = await args.rest('string');

        const result = await audio.search(query, {
            requestedBy: message.member,
            searchEngine: QueryType.AUTO
        });

        const loading = await sendLoading(message);

        if (!result?.tracks.length) this.error(languageKeys.commands.audio.playNoResult, { query });

        const queue = await audio.createQueue(message.guild, {
            metadata: message.channel
        });

        try {
            await message.guild?.channels.fetch(message.member?.voice.channelId as string);
            if (!queue.connection) await queue.connect(message.member?.voice.channelId as string);
        } catch (e) {
            this.container.logger.error(e);
            await audio.deleteQueue(message.guild?.id as string);
            this.error(languageKeys.commands.audio.playErrorJoining);
        }

        // eslint-disable-next-line no-unused-expressions
        result.playlist ? queue.addTracks(result.tracks) : queue.addTrack(result.tracks[0]);
        if (!queue.playing) await queue.play();
        loading.delete();
    }

}