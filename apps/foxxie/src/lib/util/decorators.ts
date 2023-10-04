import { LanguageKeys } from '#lib/I18n';
import { GuildMessage } from '#lib/Types';
import { createClassDecorator, createFunctionPrecondition, createProxy } from '@sapphire/decorators';
import { ApplicationCommandRegistry, UserError } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { ArgumentTypes } from '@sapphire/utilities';

export function RegisterChatInputCommand(
    options: ArgumentTypes<ApplicationCommandRegistry['registerChatInputCommand']>[0],
    extraOptions?: ApplicationCommandRegistry.RegisterOptions
) {
    return createClassDecorator(target =>
        createProxy(target, {
            construct: (ctor, [context, baseOptions = {}]) => {
                const name: string = Reflect.get(baseOptions, 'name');

                container.applicationCommandRegistries.acquire(name).registerChatInputCommand(options, extraOptions);

                return new ctor(context, {
                    ...baseOptions,
                    ...options
                });
            }
        })
    );
}

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
