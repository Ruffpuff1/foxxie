import { Listener } from '@sapphire/framework';
import type { FoxxieCommand } from '../../lib/structures';
import { blue } from 'colorette';
import type { Message, Guild } from 'discord.js';

export default class extends Listener {

    async run(msg: Message, command: FoxxieCommand): Promise<void> {
        const shard = msg.guild ? msg.guild.shardId : 0;
        // eslint-disable-next-line no-console
        this.container.logger.debug([
            `[${blue(shard)}]`,
            `-`,
            `${blue(command.name)}`,
            msg.author.username,
            `[${blue(msg.author.id)}]`,
            (msg.guild as Guild)?.name,
            `[${blue((msg.guild as Guild)?.id)}]`
        ].join(' '));
    }

}