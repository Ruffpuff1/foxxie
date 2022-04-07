import { ModerationTask, ModerationData } from '../../lib/moderation';
import { Guild, Permissions } from 'discord.js';
import { fetchT } from '@sapphire/plugin-i18next';
import { languageKeys } from '../../lib/i18n';
import { getModeration } from '../../lib/util';

export default class FoxxieModerationTask extends ModerationTask {

    async handle(guild: Guild, data: ModerationData): Promise<null> {
        const me = guild.me === null ? await guild.members.fetch(process.env.CLIENT_ID as string) : guild.me;
        if (!me.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return null;

        const t = await fetchT(guild);
        const reason = t(languageKeys.moderation.unmute, { context: 'reason', duration: Date.now() - data.duration });

        await getModeration(guild).actions.unmute(
            {
                userId: data.userId,
                moderatorId: data.moderatorId,
                channelId: data.channelId,
                reason
            },
            await this.getDmData(guild)
        );

        return null;
    }

}