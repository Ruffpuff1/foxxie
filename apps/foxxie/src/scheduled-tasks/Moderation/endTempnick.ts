import { LanguageKeys } from '#lib/i18n';
import { ModerationData, ModerationTask } from '#lib/structures';
import { Schedules } from '#utils/constants';
import { getModeration } from '#utils/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchT } from '@sapphire/plugin-i18next';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import type { Guild } from 'discord.js';

@ApplyOptions<ModerationTask.Options>({
    name: Schedules.EndTempNick
})
export class UserTask extends ModerationTask {
    protected async handle(guild: Guild, data: ModerationData<{ nickname: string }>): Promise<null> {
        const me = await this.fetchMe(guild);
        if (!me.permissions.has(PermissionFlagsBits.ManageNicknames)) return null;

        const t = await fetchT(guild);
        const reason = t(LanguageKeys.Moderation.Unnickname, this.ctx(data.duration));

        await getModeration(guild).actions.unNickname(
            {
                userId: data.userId,
                moderatorId: data.moderatorId,
                channelId: data.channelId,
                refrence: data.caseId,
                reason
            },
            await this.getDmData(guild),
            data.extra.nickname
        );

        return null;
    }
}
