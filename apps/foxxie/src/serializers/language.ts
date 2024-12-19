import type { Awaitable } from '@sapphire/utilities';

import { Serializer } from '#lib/database/settings/structures/Serializer';

export class UserSerializer extends Serializer<string> {
	public isValid(value: string): Awaitable<boolean> {
		return this.container.i18n.languages.has(value);
	}

	public async parse(args: Serializer.Args) {
		return this.result(args, await args.pickResult('language'));
	}
}
