import type { Awaitable } from '@sapphire/utilities';

import { Serializer } from '#lib/database/settings/structures/Serializer';

export class UserSerializer extends Serializer<string> {
	public isValid(value: string, context: Serializer.UpdateContext): Awaitable<boolean> {
		return this.minOrMax(value, value.length, context).isOk();
	}

	public async parse(args: Serializer.Args, { entry }: Serializer.UpdateContext) {
		return this.result(args, await args.restResult('string', { maximum: entry.maximum, minimum: entry.minimum }));
	}
}
