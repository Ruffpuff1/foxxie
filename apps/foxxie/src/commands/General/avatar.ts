import { Message, GuildMember, User, MessageEmbed, DynamicImageFormat, AllowedImageSize } from 'discord.js';
import { FoxxieCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { LanguageKeys } from '#lib/i18n';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import type { GuildMessage } from '#lib/types';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['av', 'pfp'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    description: LanguageKeys.Commands.General.AvatarDescription,
    flags: ['u', 'user']
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        // fetch either the guildmember, user or self.
        const entity = await this.getEntity(msg, args);
        const isAnimated = entity.avatar?.startsWith('a_');

        this.format('png', entity);

        const formats = [
            this.format('png', entity),
            this.format('jpg', entity),
            this.format('jpeg', entity),
            this.format('webp', entity),
            isAnimated ? this.format('gif', entity) : null
        ]
            .filter(a => Boolean(a))
            .join(' | ');

        const userAvatar =
            entity instanceof GuildMember
                ? entity.user.displayAvatarURL({
                      format: 'png',
                      size: 2048,
                      dynamic: true
                  })
                : entity.displayAvatarURL({
                      format: 'png',
                      size: 2048,
                      dynamic: true
                  });

        const embed = new MessageEmbed()
            .setColor(args.color)
            .setAuthor({
                name: `${entity instanceof GuildMember ? entity.user.username : entity.username} [${entity.id}]`,
                iconURL: userAvatar
            })
            .setDescription(formats)
            .setImage(entity.displayAvatarURL({ size: 2048, dynamic: true }));

        return send(msg, { embeds: [embed] });
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

    private format(format: DynamicImageFormat, entity: GuildMember | User, size: AllowedImageSize = 2048) {
        return `[${format.toUpperCase()}](${entity.displayAvatarURL({ format, size, dynamic: true })})`;
    }
}
