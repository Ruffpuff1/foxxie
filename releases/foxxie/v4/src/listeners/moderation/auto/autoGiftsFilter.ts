import { ModerationListener } from '../../../lib/moderation';
import { languageKeys } from '../../../lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import { guildSettings } from '../../../lib/database';
import type { GuildMessage } from '../../../lib/types/Discord';
import { deleteMessage, sendTemporaryMessage } from '../../../lib/util';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';

@ApplyOptions<ModerationListener.Options>({
    keyEnabled: guildSettings.moderation.giftsEnabled,
    softPunishmentPath: guildSettings.moderation.giftsSoftPunish,
    hardPunishmentPath: guildSettings.moderation.giftsHardPunish,
    hardPunishDuration: guildSettings.moderation.giftsHardPunishDuration,
    reasonLanguageKey: languageKeys.moderation.automod.giftReason
})
export default class extends ModerationListener {

    public giftRegex = /(https?:\/\/)?(www\.)?(discord\.gift|discord(app)?\.com\/gifts)\/(\s)?.+/gi;

    public async preProcess(msg: GuildMessage): Promise<(string | null)[] | null> {
        let value;
        const results = [];
        const scanned = new Set();
        while ((value = this.giftRegex.exec(msg.content)) !== null) {
            if (!value[0]) continue;
            if (scanned.has(value[0])) continue;
            scanned.add(value[0]);

            results.push(Promise.resolve(value[0]));
        }

        const resolved = (await Promise.all(results)).filter(gift => !!gift);
        return resolved.length === 0 ? null : resolved;
    }

    onDelete(msg: GuildMessage): Promise<Message> {
        return deleteMessage(msg);
    }

    onAlert(msg: GuildMessage, t: TFunction): void {
        sendTemporaryMessage(msg, t(languageKeys.moderation.automod.giftReason, { author: msg.author.toString() }));
    }

}