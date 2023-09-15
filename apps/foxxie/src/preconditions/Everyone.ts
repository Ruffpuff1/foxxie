import { PermissionLevelPrecondition } from '#lib/Structures';
import { ApplyOptions } from '@sapphire/decorators';
import type { Result, UserError } from '@sapphire/framework';

@ApplyOptions<PermissionLevelPrecondition.Options>({
    guildOnly: false
})
export class UserPrecondition extends PermissionLevelPrecondition {
    public async handle(): Promise<Result<unknown, UserError>> {
        return this.ok();
    }
}
