import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { EmbedBuilder, GuildMember, ImageExtension, ImageFormat, ImageSize, User } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['av', 'pfp'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    description: LanguageKeys.Commands.General.AvatarDescription,
    flags: ['u', 'user']
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        // fetch either the guildmember, user or self.
        const entity = await this.getEntity(msg, args);

        this.format(ImageFormat.PNG, entity);

        const formats = [
            this.format(ImageFormat.PNG, entity),
            this.format(ImageFormat.JPEG, entity),
            this.format(ImageFormat.WebP, entity)
        ]
            .filter(a => Boolean(a))
            .join(' | ');

        const userAvatar =
            entity instanceof GuildMember
                ? entity.user.displayAvatarURL({
                      extension: ImageFormat.PNG,
                      size: 2048
                  })
                : entity.displayAvatarURL({
                      extension: ImageFormat.PNG,
                      size: 2048
                  });

        const embed = new EmbedBuilder()
            .setColor(args.color)
            .setAuthor({
                name: `${entity instanceof GuildMember ? entity.user.username : entity.username} [${entity.id}]`,
                iconURL: userAvatar
            })
            .setDescription(formats)
            .setImage(entity.displayAvatarURL({ size: 2048 }));

        await send(msg, { embeds: [embed] });
    }

    private async getEntity(msg: GuildMessage, args: FoxxieCommand.Args): Promise<GuildMember | User> {
        const isUser = args.getFlags('u', 'user');

        if (args.finished) {
            return isUser ? msg.author : msg.member;
        }

        if (isUser) {
            return args.pick('username');
        }

        return args.pick('member').catch(() => args.pick('username').catch(() => msg.member));
    }

    private format(extension: ImageExtension, entity: GuildMember | User, size: ImageSize = 2048) {
        return `[${extension.toUpperCase()}](${entity.displayAvatarURL({ extension, size })})`;
    }
}
