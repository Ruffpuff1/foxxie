import { FoxxieCommand } from '../../lib/structures/commands';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';
import type { GuildMessage } from '../../lib/types/Discord';
import type { MessageReaction } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['dc', 'die', 'fuckoff'],
    description: languageKeys.commands.audio.stopDescription,
    audio: true
})
export default class extends FoxxieCommand {

    public async messageRun(msg: GuildMessage): Promise<MessageReaction> {
        const queue = this.container.client.audio?.getQueue(msg.guild.id);
        if (!queue || !queue.playing) this.error(languageKeys.commands.audio.stopNoSong);

        queue.destroy();
        return msg.react('🤙');
    }

}