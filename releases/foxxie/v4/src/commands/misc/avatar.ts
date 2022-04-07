import { Permissions, Message, GuildMember, User } from 'discord.js';
import { FoxxieCommand } from '../../lib/structures';
import { FoxxieEmbed } from '../../lib/discord';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['av', 'pfp'],
    requiredClientPermissions: [Permissions.FLAGS.EMBED_LINKS],
    description: languageKeys.commands.misc.avatar.description,
    detailedDescription: languageKeys.commands.misc.avatar.extendedUsage,
    flags: ['u', 'user']
})
export default class extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const entity = await this.getEntity(msg, args);
        const animated = entity?.avatar?.startsWith('a_') || (entity as GuildMember).user.avatar?.startsWith('a_');

        const formats = [
            `[PNG](${entity?.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })})`,
            `[JPG](${entity?.displayAvatarURL({ format: 'jpg', size: 2048, dynamic: true })})`,
            `[JPEG](${entity?.displayAvatarURL({ format: 'jpeg', size: 2048, dynamic: true })})`,
            `[WEBP](${entity?.displayAvatarURL({ format: 'webp', size: 2048, dynamic: true })})`,
            animated
                ? `[GIF](${entity?.displayAvatarURL({ format: 'gif', size: 2048, dynamic: true })})`
                : null
        ].filter(a => !!a).join(' | ');

        const userAvatar = entity instanceof GuildMember
            ? entity.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })
            : entity?.displayAvatarURL({ format: 'png', size: 2048, dynamic: true });

        const embed = new FoxxieEmbed(msg)
            .setColor(await this.container.db.fetchColor(msg))
            .setAuthor(`${(entity as User).tag ?? (entity as GuildMember).user.tag} [${entity?.id}]`, userAvatar)
            .setDescription(formats)
            .setImage(entity?.displayAvatarURL({ size: 2048, dynamic: true }) as string);

        return send(msg, { embeds: [embed] });
    }

    async getEntity(msg: Message, args: FoxxieCommand.Args): Promise<GuildMember | User | null> {
        const userFlag = args.getFlags('u', 'user');

        return args.finished
            ? msg[userFlag ? 'author' : 'member']
            : userFlag
                ? args.pick('user')
                : args.pick('member')
                    .catch(async () => args.pick('user')
                        .catch(() => msg.member)
                    );
    }

}