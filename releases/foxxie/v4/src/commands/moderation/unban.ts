import { ModerationCommand } from '../../lib/moderation';
import { ApplyOptions } from '@sapphire/decorators';
import { getModeration } from '../../lib/util';
import { GuildMember, Permissions, User } from 'discord.js';
import type { GuildMessage } from '../../lib/types/Discord';
import type { ModerationEntity } from '../../lib/database';
import type { TFunction } from '@sapphire/plugin-i18next';
import { languageKeys } from '../../lib/i18n';
import { fromAsync } from '@sapphire/framework';

@ApplyOptions<ModerationCommand.Options>({
    aliases: ['ub', 'unbean'],
    successKey: languageKeys.commands.moderation.unbanSuccess,
    description: languageKeys.commands.moderation.unbanDescription,
    detailedDescription: languageKeys.commands.moderation.unbanExtendedUsage,
    requiredClientPermissions: [Permissions.FLAGS.BAN_MEMBERS],
    requiredUserPermissions: [Permissions.FLAGS.BAN_MEMBERS]
})
export default class extends ModerationCommand {

    async log(msg: GuildMessage, successes: User[], duration: number | null, reason: string): Promise<ModerationEntity> {
        return (await getModeration(msg.guild).actions.unban(
            {
                userId: successes.map(user => user.id),
                channelId: msg.channel.id,
                moderatorId: msg.author.id,
                reason,
                duration
            },
            await this.getDmData(msg)
        ))!;
    }

    async checkModerable(msg: GuildMessage, target: User, t: TFunction): Promise<GuildMember> {
        const member = await super.checkModerable(msg, target, t);

        const result = await fromAsync(msg.guild.bans.fetch());
        const bans = result.success ? result.value.map(ban => ban.user.id) : null;

        if (member && !bans?.includes(member.id)) throw t(languageKeys.commands.moderation.errorNotBanned, { target: `**${target.tag}**` });
        return member;
    }

}