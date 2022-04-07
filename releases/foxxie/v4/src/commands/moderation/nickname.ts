import { ModerationCommand, ResolvedArgs } from '../../lib/moderation';
import { ApplyOptions } from '@sapphire/decorators';
import { getModeration, years } from '../../lib/util';
import { Permissions, User } from 'discord.js';
import type { GuildMessage } from '../../lib/types/Discord';
import type { ModerationEntity } from '../../lib/database';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<ModerationCommand.Options>({
    aliases: ['sn', 'setnickname'],
    successKey: languageKeys.commands.moderation.nicknameSuccess,
    description: languageKeys.commands.moderation.nicknameDescription,
    detailedDescription: languageKeys.commands.moderation.nicknameExtendedUsage,
    requiredClientPermissions: [Permissions.FLAGS.MANAGE_NICKNAMES],
    requiredUserPermissions: [Permissions.FLAGS.MANAGE_NICKNAMES],
    memberOnly: true,
    duration: true
})
export default class FoxxieModerationCommand extends ModerationCommand {

    async resolveArgs(args: ModerationCommand.Args): Promise<NicknameArgs> {
        return {
            targets: await args.repeat('user', { times: 10 }),
            nickname: args.finished ? null : await args.pick('string'),
            duration: this.duration ? await args.pick('timespan', { minimum: 0, maximum: years(5) }).catch(() => null) : null,
            reason: args.finished ? null : await args.rest('string')
        };
    }

    // eslint-disable-next-line max-params
    async log(msg: GuildMessage, successes: User[], duration: number | null, reason: string, _args: ModerationCommand.Args, resolveArgs: NicknameArgs): Promise<ModerationEntity> {
        const { nickname } = resolveArgs;

        return (await getModeration(msg.guild).actions.setNickname(
            {
                userId: successes.map(user => user.id),
                channelId: msg.channel.id,
                moderatorId: msg.author.id,
                reason,
                duration
            },
            await this.getDmData(msg),
            nickname
        ))!;
    }

}

interface NicknameArgs extends ResolvedArgs {
    nickname: string | null;
}