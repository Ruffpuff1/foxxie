import { LanguageKeys } from '#lib/i18n';
import { ModerationData, ModerationTask } from '#lib/structures';
import { getModeration } from '#utils/Discord';
import { Schedules } from '#utils/constants';
import { getT } from '@foxxie/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import type { Guild } from 'discord.js';

@ApplyOptions<ModerationTask.Options>({
    name: Schedules.EndTempBan
})
export class UserTask extends ModerationTask {
    protected async handle(guild: Guild, data: ModerationData): Promise<null> {
        const me = await this.fetchMe(guild);
        if (!me.permissions.has(PermissionFlagsBits.BanMembers)) return null;

        const t = getT('en-US');
        const reason = t(LanguageKeys.Moderation.Unban, this.ctx(data.duration));

        await getModeration(guild).actions.unban(
            {
                userId: data.userId,
                moderatorId: data.moderatorId,
                channelId: data.channelId,
                refrence: data.caseId,
                guildId: guild.id,
                reason
            },
            await this.getDmData(guild)
        );

        return null;
    }
}
