import type { Awaitable } from '@sapphire/utilities';

import { Serializer } from '#lib/Database/settings/structures/Serializer';
import { LanguageKeys } from '#lib/i18n';

export class UserSerializer extends Serializer<string> {
	public isValid(value: string, { entry, guild, t }: Serializer.UpdateContext): Awaitable<boolean> {
		if (guild.roles.cache.has(value)) return true;
		throw t(LanguageKeys.Serializers.InvalidRole, { name: entry.name });
	}

	public async parse(args: Serializer.Args) {
		const result = await args.pickResult('role');
		return result.match({
			err: (error) => this.errorFromArgument(args, error),
			ok: (value) => this.ok(value.id)
		});
	}

	public override stringify(value: string, { guild }: Serializer.UpdateContext) {
		return guild.roles.cache.get(value)?.name ?? value;
	}
}
