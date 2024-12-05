import { LanguageKeys } from '#lib/i18n';
import { PermissionLevelPrecondition } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { isModerator } from '#utils/discord';
import { UserError } from '@sapphire/framework';
import { Result } from '@sapphire/result';

export class UserPrecondition extends PermissionLevelPrecondition {
	public async handle(message: GuildMessage): Promise<Result<unknown, UserError>> {
		return isModerator(message.member) ? this.ok() : this.error({ identifier: LanguageKeys.Preconditions.Moderator });
	}
}
