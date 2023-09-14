import { Serializer, SerializerUpdateContext } from '#lib/database';
import { LanguageKeys } from '#lib/I18n';
import type { Awaitable } from '@sapphire/utilities';

export class UserSerializer extends Serializer<string> {
    public async parse(args: Serializer.Args) {
        const role = await args.pickResult('role');
        return role.isOk() ? this.ok(role.unwrap().id) : this.errorFromArgument(args, role.unwrapErr());
    }

    public isValid(value: string, { t, entry, guild }: SerializerUpdateContext): Awaitable<boolean> {
        if (guild.roles.cache.has(value)) return true;
        throw t(LanguageKeys.Serializers.InvalidRole, { name: entry.name });
    }

    public stringify(value: string, { guild }: SerializerUpdateContext) {
        return guild.roles.cache.get(value)?.name ?? value;
    }
}
