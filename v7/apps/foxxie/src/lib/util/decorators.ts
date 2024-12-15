import { LanguageKeys } from '#lib/I18n';
import { GuildMessage } from '#lib/Types';
import { createFunctionPrecondition } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { container } from '@sapphire/pieces';

export const RequiresLastFmUsername = (
    thrownError: string = LanguageKeys.Preconditions.LastFmUsername,
    userErrorOptions?: Omit<UserError.Options, 'identifier'>
): MethodDecorator => {
    return createFunctionPrecondition(
        async (message: GuildMessage) => {
            const entity = await container.db.users.ensure(message.member.id);
            if (entity.lastFm.username) return true;
            return false;
        },
        () => {
            throw new UserError({ identifier: thrownError, ...userErrorOptions });
        }
    );
};
