import { LanguageKeys } from '#lib/i18n';
import { ModerationData, ModerationTask } from '#lib/structures';
import { Schedules } from '#utils/constants';
import { getModeration } from '#utils/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchT } from '@sapphire/plugin-i18next';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import type { Guild } from 'discord.js';

@ApplyOptions<ModerationTask.Options>({
    name: Schedules.EndTempBan
})
export class UserTask extends ModerationTask {
    protected async handle(guild: Guild, data: ModerationData): Promise<null> {
        const me = await this.fetchMe(guild);
        if (!me.permissions.has(PermissionFlagsBits.BanMembers)) return null;

        const t = await fetchT(guild);
        const reason = t(LanguageKeys.Moderation.Unban, this.ctx(data.duration));

        await getModeration(guild).actions.unban(
            {
                userId: data.userId,
                moderatorId: data.moderatorId,
                channelId: data.channelId,
                refrence: data.caseId,
                reason
            },
            await this.getDmData(guild)
        );

        return null;
    }
}
