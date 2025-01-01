import { createFunctionPrecondition } from '@sapphire/decorators';
import { container, UserError } from '@sapphire/framework';
import { GuildMessage } from '#lib/types';

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
