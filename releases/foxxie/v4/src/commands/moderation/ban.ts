import { ModerationCommand } from '../../lib/moderation';
import { ApplyOptions } from '@sapphire/decorators';
import { getModeration } from '../../lib/util';
import { GuildMember, Permissions, User } from 'discord.js';
import type { GuildMessage } from '../../lib/types/Discord';
import type { ModerationEntity } from '../../lib/database';
import type { TFunction } from '@sapphire/plugin-i18next';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<ModerationCommand.Options>({
    aliases: ['b', 'bean', 'yeet'],
    successKey: languageKeys.commands.moderation.banSuccess,
    description: languageKeys.commands.moderation.banDescription,
    detailedDescription: languageKeys.commands.moderation.banExtendedUsage,
    requiredClientPermissions: [Permissions.FLAGS.BAN_MEMBERS],
    requiredUserPermissions: [Permissions.FLAGS.BAN_MEMBERS],
    options: ['d', 'days'],
    flags: ['s', 'soft'],
    duration: true
})
export default class extends ModerationCommand {

    async log(msg: GuildMessage, successes: User[], duration: number | null, reason: string, args: ModerationCommand.Args): Promise<ModerationEntity> {
        if (args.getFlags('s', 'soft')) {
            if (duration) this.error(languageKeys.commands.moderation.banConflict);
            return getModeration(msg.guild).actions.softban(
                {
                    userId: successes.map(user => user.id),
                    channelId: msg.channel.id,
                    moderatorId: msg.author.id,
                    reason,
                    duration
                },
                this.getDays(args),
                await this.getDmData(msg)
            ) as unknown as ModerationEntity;
        }

        return getModeration(msg.guild).actions.ban(
            {
                userId: successes.map(user => user.id),
                channelId: msg.channel.id,
                moderatorId: msg.author.id,
                reason,
                duration
            },
            this.getDays(args),
            await this.getDmData(msg)
        ) as unknown as ModerationEntity;
    }

    private getDays(args: ModerationCommand.Args): number {
        let number: string | null | number = args.getOption('d', 'days');
        if (!number) return 0;


        number = parseInt(number);
        if (number > 7 || number < 1) return 0;
        return number;
    }

    async checkModerable(msg: GuildMessage, target: User, t: TFunction): Promise<GuildMember> {
        const member = await super.checkModerable(msg, target, t);
        if (member && !member.bannable) throw t(languageKeys.commands.moderation.errorBannable, { target: `**${target.tag}**` });
        return member;
    }

}