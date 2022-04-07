import { Listener, ListenerOptions } from '@sapphire/framework';
import { hours, isOnServer } from '../../../lib/util';
import type { GuildMessage } from '../../../lib/types/Discord';
import { ApplyOptions } from '@sapphire/decorators';

const disboardRegex = /(?<prefix>Bump\sdone)!?\s:thumbsup:\s+Check\sit\sout\s\[on\sDISBOARD]\(https:\/\/disboard\.org(\/servers?)?(\/?(?<serverId>\d{17,19}))?\)\.?$/;

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer()
})
export class FoxxieListener extends Listener {

    public async run(msg: GuildMessage): Promise<boolean> {
        if (this.findTask(msg)) return false;

        const [embed] = msg.embeds;
        if (!disboardRegex.test(embed.description!)) return false;

        await this.container.schedule.add('disboard', Date.now() + hours(2), {
            data: { guildId: msg.guild.id }
        });

        return true;
    }

    findTask(msg: GuildMessage): boolean {
        return Boolean(this.container.schedule.queue.find(task => task.taskId === 'disboard' && task.data.guildId === msg.guild.id));
    }

}