import { createFunctionPrecondition } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { LanguageKeys } from '#lib/i18n';
import { GuildMessage } from '#lib/types';

export const RequiresLastFMUsername = (
	thrownError: string = LanguageKeys.Preconditions.LastFMLogin,
	userErrorOptions?: Omit<UserError.Options, 'identifier'>
): MethodDecorator => {
	return createFunctionPrecondition(
		async (message: GuildMessage) => {
			const entity = await container.prisma.userLastFM.findFirst({ where: { userid: message.author.id } });
			if (entity?.usernameLastFM) return true;
			return false;
		},
		() => {
			throw new UserError({ identifier: thrownError, ...userErrorOptions });
		}
	);
};

export const RequiresStarboardEntries = (
	thrownError: string = 'preconditions:starboardNoEntries',
	userErrorOptions?: Omit<UserError.Options, 'identifier'>
): MethodDecorator => {
	return createFunctionPrecondition(
		async (message: GuildMessage) => {
			const entity = await container.prisma.starboard.findFirst({ where: { guildId: message.guild.id } });
			if (!entity) return false;
			return true;
		},
		() => {
			throw new UserError({ identifier: thrownError, ...userErrorOptions });
		}
	);
};
