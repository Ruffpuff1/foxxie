import { LanguageKeys } from '#lib/i18n';
import { Argument, ArgumentContext, Piece, Store } from '@sapphire/framework';

export class UserArgument extends Argument<Store<Piece>> {
    public possibles: readonly string[] = [];

    public async run(parameter: string, context: ArgumentContext) {
        for (const store of this.container.stores.values()) {
            if (store.name === parameter) return this.ok(store);
        }
        return this.error({
            parameter,
            identifier: LanguageKeys.Arguments.Store,
            context: { ...context, possibles: this.possibles }
        });
    }

    public onLoad() {
        this.possibles = this.container.stores.map(store => `\`${store.name}\``);
        return super.onLoad();
    }
}
