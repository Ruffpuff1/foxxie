import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { Result } from 'lexure';
import { cleanMentions } from '../lib/util';

export default class extends Argument<string> {

    public async run(parameter: string, context: ArgumentContext): Promise<Result<string, UserError>> {
        const clean = context.message.guild ? cleanMentions(context.message.guild, parameter) : parameter;
        return this.ok(clean);
    }

}