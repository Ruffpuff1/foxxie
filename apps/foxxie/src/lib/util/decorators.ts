import { createFunctionPrecondition } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { GuildMessage } from '#lib/types';

export const RequiresLastFmUsername = (
	thrownError: string = 'preconditions:lastFmLogin',
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
