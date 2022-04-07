import { createFunctionPrecondition } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { PermissionResolvable, Permissions, Message, TextChannel, GuildMember } from 'discord.js';

export const RequiresPermissions = (
    permissions: PermissionResolvable,
    errorKey: string,
    userErrorOptions?: Record<string, unknown>
): MethodDecorator => {
    return createFunctionPrecondition(
        (message: Message) => {
            if (!message.guild) return true;
            if (message.author.id === message.guild.ownerId) return true;

            const req = new Permissions(permissions);

            return (message.channel as TextChannel).permissionsFor(
                message.member as GuildMember
            ).has(req.bitfield);
        },
        () => {
            throw new UserError({ identifier: errorKey, context: userErrorOptions });
        }
    );
};