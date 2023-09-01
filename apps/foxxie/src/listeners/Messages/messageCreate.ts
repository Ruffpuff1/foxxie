import { EventArgs, FoxxieEvents, GuildMessage } from '#lib/types';
import { cast } from '@ruffpuff/utilities';
import { Listener } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';

export class UserListener extends Listener<FoxxieEvents.MessageCreate> {
    public run(...[message]: EventArgs<FoxxieEvents.MessageCreate>): void {
        if (isNullish(message.guild) || isNullish(message.member)) return;

        if (message.system) {
            this.container.client.emit(FoxxieEvents.SystemMessage, cast<GuildMessage>(message));
            return;
        }

        if (message.author.bot) {
            this.container.client.emit(FoxxieEvents.BotMessage, cast<GuildMessage>(message));
        } else {
            this.container.client.emit(FoxxieEvents.UserMessage, cast<GuildMessage>(message));
        }

        this.container.client.emit(FoxxieEvents.StatsMessage, message.guild.id, message.member);
    }
}
