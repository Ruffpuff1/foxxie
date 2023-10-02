import { createClassDecorator, createProxy } from '@sapphire/decorators';
import { ApplicationCommandRegistry } from '@sapphire/framework';
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
