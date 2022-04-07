import { FoxxieCommand } from '../../lib/structures/commands';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@skyra/editable-commands';
import { languageKeys } from '../../lib/i18n';
import type { GuildMessage } from '../../lib/types/Discord';
import type { Message } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['s'],
    description: languageKeys.commands.audio.skipDescription,
    audio: true
})
export default class extends FoxxieCommand {

    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const queue = this.container.client.audio?.getQueue(msg.guild.id);
        if (!queue || !queue.playing) this.error(languageKeys.commands.audio.skipNoSong);

        queue.skip();
        return send(msg, args.t(languageKeys.commands.audio.skipSuccess, { song: queue.current.title }));
    }

}