import { LanguageKeys } from '#lib/I18n';
import { PermissionLevelPrecondition } from '#lib/Structures';
import type { GuildMessage } from '#lib/Types';
import { isModerator } from '#utils/Discord';
import type { Result, UserError } from '@sapphire/framework';

export class UserPrecondition extends PermissionLevelPrecondition {
    public async handle(message: GuildMessage): Promise<Result<unknown, UserError>> {
        return isModerator(message.member) ? this.ok() : this.error({ identifier: LanguageKeys.Preconditions.Moderator });
    }
}
