import { Serializer, SerializerUpdateContext } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import type { Awaitable } from '@sapphire/utilities';

export class UserSerializer extends Serializer<string> {
    public async parse(args: Serializer.Args) {
        const result = await args.pickResult('guildTextChannel');
        return result.isOk() ? this.ok(result.unwrap().id) : this.errorFromArgument(args, result.unwrapErr());
    }

    public isValid(value: string, context: SerializerUpdateContext): Awaitable<boolean> {
        return context.guild.channels.cache.has(value);
    }

    public stringify(value: string, context: SerializerUpdateContext): string {
        return context.guild.channels.cache.get(value)?.name ?? context.t(LanguageKeys.Serializers.UnknownChannel);
    }
}
