import { LevelingRole, Serializer, SerializerUpdateContext } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import type { Awaitable } from '@sapphire/utilities';

@ApplyOptions<Serializer.Options>({
    aliases: ['lvlrole']
})
export class UserSerializer extends Serializer<LevelingRole> {
    public async parse(args: Serializer.Args) {
        const role = await args.pickResult('role');
        const level = await args.pickResult('number');

        if (role.error) return this.errorFromArgument(args, role.error);
        if (level.error) return this.errorFromArgument(args, level.error);

        return this.ok({ id: role.value.id, level: level.value });
    }

    public isValid(value: LevelingRole, { t, entry, guild }: SerializerUpdateContext): Awaitable<boolean> {
        if (guild.roles.cache.has(value.id)) return true;
        throw t(LanguageKeys.Serializers.InvalidRole, { name: entry.name });
    }

    public stringify(value: LevelingRole, { t, guild }: SerializerUpdateContext): string {
        const name = guild.roles.cache.get(value.id)?.name ?? t(LanguageKeys.Serializers.UnknownRole);
        return `[ ${t(LanguageKeys.Commands.Social.Level)} ${value.level} ] → ${name}`;
    }
}
