import { Serializer, SerializerUpdateContext } from '#lib/database';
import { ApplyOptions } from '@sapphire/decorators';
import type { Awaitable } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<Serializer.Options>({
    aliases: ['integer', 'float']
})
export class UserSerializer extends Serializer<number> {
    public async parse(args: Serializer.Args, { entry }: SerializerUpdateContext) {
        return this.result(args, await args.pickResult(entry.type as 'integer' | 'number' | 'float'));
    }

    public isValid(value: number, context: SerializerUpdateContext): Awaitable<boolean> {
        switch (context.entry.type) {
            case 'integer': {
                if (typeof value === 'number' && Number.isInteger(value) && this.minOrMax(value, value, context)) return true;
                throw context.t(LanguageKeys.Serializers.InvalidInt, {
                    name: context.entry.name
                });
            }
            case 'number':
            case 'float': {
                if (typeof value === 'number' && !Number.isNaN(value) && this.minOrMax(value, value, context)) return true;
                throw context.t(LanguageKeys.Serializers.InvalidFloat, {
                    name: context.entry.name
                });
            }
        }

        throw new Error('Unreachable');
    }
}
