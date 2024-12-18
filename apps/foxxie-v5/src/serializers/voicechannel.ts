import { Serializer, SerializerUpdateContext } from '#lib/database';
import type { Awaitable } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';

export class UserSerializer extends Serializer<string> {
    public async parse(args: Serializer.Args) {
        const result = await args.pickResult('guildVoiceChannel');
        return result.success ? this.ok(result.value.id) : this.errorFromArgument(args, result.error);
    }

    public isValid(value: string, context: SerializerUpdateContext): Awaitable<boolean> {
        return context.guild.channels.cache.has(value);
    }

    public stringify(value: string, context: SerializerUpdateContext): string {
        return context.guild.channels.cache.get(value)?.name ?? context.t(LanguageKeys.Serializers.UnknownChannel);
    }
}
