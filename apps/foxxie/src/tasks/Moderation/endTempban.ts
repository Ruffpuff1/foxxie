import { LanguageKeys } from '#lib/I18n';
import { ModerationData, ModerationTask } from '#lib/Structures';
import { Schedules } from '#utils/constants';
import { seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchT } from '@sapphire/plugin-i18next';
import { PermissionFlagsBits } from 'discord-api-types/v10';
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

        await this.container.redis?.pinsertex(`guild:${guild.id}:unban:${data.userId}`, seconds(20), '');

        await this.container.utilities.guild(guild).moderation.actions.unban(
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
