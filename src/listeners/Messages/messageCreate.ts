import { EventArgs, Events, GuildMessage } from '#lib/types';
import { cast } from '@ruffpuff/utilities';
import { Listener } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';

export class UserListener extends Listener<Events.MessageCreate> {
    public run(...[message]: EventArgs<Events.MessageCreate>): void {
        if (isNullish(message.guild) || isNullish(message.member)) return;

        if (message.system) {
            this.container.client.emit(Events.SystemMessage, cast<GuildMessage>(message));
            return;
        }

        if (message.author.bot) {
            this.container.client.emit(Events.BotMessage, cast<GuildMessage>(message));
        } else {
            this.container.client.emit(Events.UserMessage, cast<GuildMessage>(message));
        }

        this.container.client.emit(Events.StatsMessage, message.guild.id, message.member);
    }
}
