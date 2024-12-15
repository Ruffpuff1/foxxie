import { CLIENT_OWNERS } from '#root/config';
import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

export class UserPrecondition extends Precondition {
    public messageRun(message: Message) {
        return this.checkOwner(message.author.id);
    }

    public chatInputRun(interaction: CommandInteraction) {
        return this.checkOwner(interaction.user.id);
    }

    private checkOwner(id: string) {
        return CLIENT_OWNERS?.includes(id) ? this.ok() : this.error({ context: { silent: true } });
    }
}
