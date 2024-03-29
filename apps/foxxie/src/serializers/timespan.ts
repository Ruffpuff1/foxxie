import { Serializer, SerializerUpdateContext } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import type { Awaitable } from '@sapphire/utilities';

export class UserSerializer extends Serializer<number> {
    public async parse(args: Serializer.Args, { entry }: SerializerUpdateContext) {
        return this.result(
            args,
            await args.pickResult('timespan', {
                minimum: entry.minimum,
                maximum: entry.maximum
            })
        );
    }

    public isValid(value: number, context: SerializerUpdateContext): Awaitable<boolean> {
        if (typeof value === 'number' && Number.isInteger(value) && this.minOrMax(value, value, context)) return true;
        throw context.t(LanguageKeys.Serializers.InvalidInt, {
            name: context.entry.name
        });
    }

    public stringify(data: number, { t }: SerializerUpdateContext): string {
        return t(LanguageKeys.Globals.Remaining, { value: data });
    }
}
