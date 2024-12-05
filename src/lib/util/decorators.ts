import { LanguageKeys } from '#lib/i18n';
import { GuildMessage } from '#lib/types';
import { createFunctionPrecondition } from '@sapphire/decorators';
import { container, UserError } from '@sapphire/framework';

export const RequiresLastFmUsername = (
	thrownError: string = LanguageKeys.Preconditions.LastFmUsername,
	userErrorOptions?: Omit<UserError.Options, 'identifier'>
): MethodDecorator => {
	return createFunctionPrecondition(
		async (message: GuildMessage) => {
			const entity = await container.db.users.ensure(message.member.id);
			console.log(entity);
			// if (entity.lastFm.username) return true;
			return false;
		},
		() => {
			throw new UserError({ identifier: thrownError, ...userErrorOptions });
		}
	);
};
