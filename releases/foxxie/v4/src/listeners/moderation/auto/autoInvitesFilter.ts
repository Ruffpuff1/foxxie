import { ModerationListener } from '../../../lib/moderation';
import { languageKeys } from '../../../lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import { guildSettings } from '../../../lib/database';
import type { GuildMessage } from '../../../lib/types/Discord';
import { deleteMessage, resolveToNull, sendTemporaryMessage } from '../../../lib/util';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { Invite, Message } from 'discord.js';

@ApplyOptions<ModerationListener.Options>({
    keyEnabled: guildSettings.moderation.invitesEnabled,
    softPunishmentPath: guildSettings.moderation.invitesSoftPunish,
    hardPunishmentPath: guildSettings.moderation.invitesHardPunish,
    hardPunishDuration: guildSettings.moderation.invitesHardPunishDuration,
    reasonLanguageKey: languageKeys.moderation.automod.inviteReason
})
export default class extends ModerationListener {

    public inviteRegex = /(?<proto>https?:\/\/)?(.*?@)?(www\.)?(?<source>(discord|invite)\.(?:gg|io|me|plus|link)|invite\.(?:gg|ink)|discord(?:app)?\.com\/invite)\/(?<code>[\w-]{2,})/gi;

    public async preProcess(msg: GuildMessage): Promise<(string | null)[] | null> {
        let value;
        const results = [];
        const scanned = new Set();
        while ((value = this.inviteRegex.exec(msg.content)) !== null) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { code, source } = value.groups!;

            const key = `${source}/${code}`;
            if (scanned.has(key)) continue;
            scanned.add(key);

            results.push(Promise.resolve(this.validLink(msg, code, key)));
        }

        const resolved = (await Promise.all(results)).filter(invite => !!invite);
        return resolved.length === 0 ? null : resolved;
    }

    private async validLink(msg: GuildMessage, code: string, url: string) {
        return (await this.shouldDetect(msg, code)) ? null : url;
    }

    private async shouldDetect(msg: GuildMessage, code: string) {
        const raw = await resolveToNull(msg.guild.invites.fetch(code)) as Invite;

        if (!raw?.guild) return false;

        if (raw?.guild.id === msg.guild.id) return true;

        return false;
    }

    onDelete(msg: GuildMessage): Promise<Message> {
        return deleteMessage(msg);
    }

    onAlert(msg: GuildMessage, t: TFunction): void {
        sendTemporaryMessage(msg, t(languageKeys.moderation.automod.inviteAlert, { author: msg.author.toString() }));
    }

}