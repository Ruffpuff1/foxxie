import { Serializer, SerializerUpdateContext } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { ApplyOptions } from '@sapphire/decorators';
import type { Awaitable } from '@sapphire/utilities';

@ApplyOptions<Serializer.Options>({
    aliases: ['bool']
})
export class UserSerializer extends Serializer<boolean> {
    public async parse(args: Serializer.Args) {
        return this.result(args, await args.pickResult('boolean'));
    }

    public isValid(value: boolean): Awaitable<boolean> {
        return typeof value === 'boolean';
    }

    public stringify(value: boolean, { t }: SerializerUpdateContext): string {
        return t(value ? LanguageKeys.Arguments.BooleanEnabled : LanguageKeys.Arguments.BooleanDisabled);
    }
}
