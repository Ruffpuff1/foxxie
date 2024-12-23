import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { ModerationData, ModerationTask } from '#lib/structures';
import { Schedules } from '#utils/constants';
import { getModeration } from '#utils/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import type { Guild } from 'discord.js';

@ApplyOptions<ModerationTask.Options>({
    name: Schedules.EndTempMute
})
export class UserTask extends ModerationTask {
    protected async handle(guild: Guild, data: ModerationData): Promise<null> {
        const me = await this.fetchMe(guild);
        if (!me.permissions.has(PermissionFlagsBits.ManageRoles)) return null;

        const [roleId, t] = await this.container.db.guilds.acquire(guild.id, settings => [settings[GuildSettings.Roles.Muted], settings.getLanguage()]);
        if (!roleId) return null;

        const reason = t(LanguageKeys.Moderation.Unmute, this.ctx(data.duration));

        await getModeration(guild).actions.unmute(
            {
                userId: data.userId,
                moderatorId: data.moderatorId,
                channelId: data.channelId,
                refrence: data.caseId,
                reason,
                extraData: { roleId }
            },
            await this.getDmData(guild)
        );

        return null;
    }
}
