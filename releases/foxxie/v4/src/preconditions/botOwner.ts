import { Precondition, PreconditionError, Result, UserError } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { CLIENT_OWNERS } from '../config';

export default class extends Precondition {

    async run(message: Message): Promise<Result<unknown, UserError>> {
        return CLIENT_OWNERS?.includes(message.author.id) ? this.ok() : this.error({ context: { silent: true } } as PreconditionError);
    }

}