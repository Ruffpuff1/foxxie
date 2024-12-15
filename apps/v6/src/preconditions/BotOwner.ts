import { clientOwners } from '#root/config';
import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserPrecondition extends Precondition {
    public messageRun(message: Message) {
        return this.checkOwner(message.author.id);
    }

    private checkOwner(id: string) {
        return clientOwners?.includes(id) ? this.ok() : this.error({ context: { silent: true } });
    }
}
