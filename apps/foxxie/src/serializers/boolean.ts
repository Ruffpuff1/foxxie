import type { Awaitable } from '@sapphire/utilities';

import { Serializer } from '#lib/Database/settings/structures/Serializer';
import { LanguageKeys } from '#lib/i18n';

export class UserSerializer extends Serializer<boolean> {
	public isValid(value: boolean): Awaitable<boolean> {
		return typeof value === 'boolean';
	}

	public async parse(args: Serializer.Args) {
		return this.result(args, await args.pickResult('boolean'));
	}

	public override stringify(value: boolean, { t }: Serializer.UpdateContext): string {
		return t(value ? LanguageKeys.Arguments.BooleanEnabled : LanguageKeys.Arguments.BooleanDisabled);
	}
}
