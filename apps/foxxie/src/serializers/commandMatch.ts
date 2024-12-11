import type { Awaitable } from '@sapphire/utilities';

import { Serializer } from '#lib/Database/settings/structures/Serializer';
import { CommandMatcher } from '#lib/Database/utils/matchers/index';
import { LanguageKeys } from '#lib/i18n';

export class UserSerializer extends Serializer<string> {
	public isValid(value: string, { entry, t }: Serializer.UpdateContext): Awaitable<boolean> {
		const command = CommandMatcher.resolve(value);
		if (!command) throw t(LanguageKeys.Serializers.InvalidCommand, { name: entry.name });
		return true;
	}

	public async parse(args: Serializer.Args) {
		return this.result(args, await args.pickResult('commandMatch'));
	}

	public override stringify(value: string) {
		return (this.container.stores.get('commands').get(value) || { name: value }).name;
	}
}
