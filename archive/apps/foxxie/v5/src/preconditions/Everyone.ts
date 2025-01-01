import { ApplyOptions } from '@sapphire/decorators';
import type { Result, UserError } from '@sapphire/framework';
import { PermissionLevelPrecondition } from '#lib/structures';

@ApplyOptions<PermissionLevelPrecondition.Options>({
    guildOnly: false
})
export class UserPrecondition extends PermissionLevelPrecondition {
    public async handle(): Promise<Result<unknown, UserError>> {
        return this.ok();
    }

    public async chatInputHandle(): Promise<Result<unknown, UserError>> {
        return this.ok();
    }
}
