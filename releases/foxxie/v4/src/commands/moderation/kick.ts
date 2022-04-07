import { ModerationCommand } from '../../lib/moderation';
import { ApplyOptions } from '@sapphire/decorators';
import { getModeration } from '../../lib/util';
import { GuildMember, Permissions, User } from 'discord.js';
import type { GuildMessage } from '../../lib/types/Discord';
import type { ModerationEntity } from '../../lib/database';
import type { TFunction } from '@sapphire/plugin-i18next';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<ModerationCommand.Options>({
    aliases: ['k', 'bye', 'gone'],
    successKey: languageKeys.commands.moderation.kickSuccess,
    description: languageKeys.commands.moderation.kickDescription,
    detailedDescription: languageKeys.commands.moderation.kickExtendedUsage,
    requiredClientPermissions: [Permissions.FLAGS.KICK_MEMBERS],
    requiredUserPermissions: [Permissions.FLAGS.KICK_MEMBERS],
    memberOnly: true
})
export default class extends ModerationCommand {

    async log(msg: GuildMessage, successes: User[], duration: number | null, reason: string): Promise<ModerationEntity> {
        return getModeration(msg.guild).actions.kick(
            {
                userId: successes.map(user => user.id),
                channelId: msg.channel.id,
                moderatorId: msg.author.id,
                reason,
                duration
            },
            await this.getDmData(msg)
        ) as unknown as ModerationEntity;
    }

    async checkModerable(msg: GuildMessage, target: User, t: TFunction): Promise<GuildMember> {
        const member = await super.checkModerable(msg, target, t);
        if (member && !member.kickable) throw t(languageKeys.commands.moderation.errorKickable, { target: `**${target.tag}**` });
        return member;
    }

}