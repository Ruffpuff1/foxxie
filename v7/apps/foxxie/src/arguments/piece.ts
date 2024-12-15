import { LanguageKeys } from '#lib/I18n';
import { Argument, ArgumentContext, ArgumentResult, Piece } from '@sapphire/framework';

export class UserArgument extends Argument<Piece> {
    public async run(parameter: string, context: ArgumentContext): Promise<ArgumentResult<Piece>> {
        for (const store of this.container.stores.values()) {
            const piece = store.get(parameter);
            if (piece) return this.ok(piece);
        }
        return this.error({
            parameter,
            identifier: LanguageKeys.Arguments.Piece,
            context
        });
    }
}
