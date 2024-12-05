import { PermissionLevelPrecondition } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { Result } from '@sapphire/result';

@ApplyOptions<PermissionLevelPrecondition.Options>({
	guildOnly: false
})
export class UserPrecondition extends PermissionLevelPrecondition {
	public async handle(): Promise<Result<unknown, UserError>> {
		return this.ok();
	}
}
