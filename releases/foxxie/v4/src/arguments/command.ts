import { languageKeys } from '../lib/i18n';
import { Argument, ArgumentContext, UserError } from '@sapphire/framework';
import type { FoxxieCommand } from '../lib/structures';
import type { Result } from 'lexure';

export default class extends Argument<FoxxieCommand> {

    public async run(parameter: string, context: ArgumentContext): Promise<Result<FoxxieCommand, UserError>> {
        const resolved = this.container.stores.get('commands').get(parameter.toLowerCase()) as FoxxieCommand;
        if (resolved) return this.ok(resolved);
        return this.error({ parameter, identifier: languageKeys.arguments.invalidPiece, context });
    }

}