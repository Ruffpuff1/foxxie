import { languageKeys } from '../lib/i18n';
import { Argument, ArgumentContext, UserError, Piece } from '@sapphire/framework';
import type { Result } from 'lexure';

export default class extends Argument<Piece> {

    public async run(parameter: string, context: ArgumentContext): Promise<Result<Piece, UserError>> {
        for (const store of this.container.stores.values()) {
            const piece = store.get(parameter);
            if (piece) return this.ok(piece);
        }
        return this.error({ parameter, identifier: languageKeys.arguments.invalidPiece, context });
    }

}