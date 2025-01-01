import { ApplyOptions } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { Result } from '@sapphire/result';
import { PermissionLevelPrecondition } from '#lib/structures';

@ApplyOptions<PermissionLevelPrecondition.Options>({
	guildOnly: false
})
export class UserPrecondition extends PermissionLevelPrecondition {
	public async handle(): Promise<Result<unknown, UserError>> {
		return this.ok();
	}
}
