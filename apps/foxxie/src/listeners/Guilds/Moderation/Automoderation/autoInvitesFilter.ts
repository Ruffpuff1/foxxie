import { GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { ModerationListener } from '#lib/Structures';
import { FoxxieEvents, GuildMessage } from '#lib/Types';
import { deleteMessage, sendTemporaryMessage } from '#utils/Discord';
import { Colors, allowedInviteIds } from '#utils/constants';
import { cast } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { EmbedBuilder, Message } from 'discord.js';

@ApplyOptions<ModerationListener.Options>({
    keyEnabled: GuildSettings.Moderation.Auto.InvitesEnabled,
    softPunishmentPath: GuildSettings.Moderation.Auto.InvitesSoftPunish,
    hardPunishmentPath: GuildSettings.Moderation.Auto.InvitesHardPunish,
    hardPunishDuration: GuildSettings.Moderation.Auto.InvitesHardPunishDuration,
    reasonLanguageKey: LanguageKeys.Automod.InvitesReason
})
export class UserListener extends ModerationListener {
    private inviteRegex =
        /(?<proto>https?:\/\/)?(.*?@)?(www\.)?(?<source>(discord|invite)\.(?:gg|io|me|plus|link)|invite\.(?:gg|ink)|discord(?:app)?\.com\/invite)\/(?<code>[\w-]{2,})/gi;

    public async preProcess(...[msg]: Parameters<ModerationListener['preProcess']>): Promise<(string | null)[] | null> {
        let value;
        const results = [];
        const scanned = new Set<string>();
        while ((value = this.inviteRegex.exec(msg.content)) !== null) {
            const { code, source } = value.groups!;

            const key = `${source}/${code}`;
            if (scanned.has(key)) continue;
            scanned.add(key);

            results.push(Promise.resolve(this.validLink(msg, code, key)));
        }

        const resolved = (await Promise.all(results)).filter(invite => Boolean(invite));
        return resolved.length === 0 ? null : resolved;
    }

    protected onDelete(...[msg]: Parameters<ModerationListener['onDelete']>): Promise<Message | void | unknown> {
        return deleteMessage(msg);
    }

    protected async onAlert(...[msg, t]: Parameters<ModerationListener['onAlert']>): Promise<void> {
        await sendTemporaryMessage(msg, t(LanguageKeys.Automod.InvitesAlert, { author: msg.author.toString() }));
    }

    protected onLog(...[msg, t, value]: Parameters<ModerationListener['onLog']>): void {
        const invites = cast<string[]>(value);

        this.container.client.emit(FoxxieEvents.GuildMessageLog, msg.guild, GuildSettings.Channels.Logs.FilterWords, () =>
            new EmbedBuilder()
                .setColor(Colors.Red)
                .setAuthor({
                    name: t(LanguageKeys.Guilds.Logs.ActionFilterInvites, { count: invites.length }),
                    iconURL: msg.member.displayAvatarURL()
                })
                .setDescription(
                    [
                        t(LanguageKeys.Guilds.Logs.ArgsUser, { user: msg.author }),
                        t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel: msg.channel }),
                        t(LanguageKeys.Guilds.Logs.ArgsInvites, { invites, count: invites.length })
                    ].join('\n')
                )
        );
    }

    private async validLink(msg: GuildMessage, code: string, url: string) {
        return (await this.allowedLink(msg, code)) ? null : url;
    }

    private async allowedLink(msg: GuildMessage, code: string) {
        const data = await msg.client.invites.fetch(code);

        if (!data.valid) return true;

        if (!data.guild) return true;

        if (data.guild.id === null) return false;

        if (data.guild.id === msg.guild.id) return true;

        if (allowedInviteIds.includes(data.guild.id)) return true;

        return false;
    }
}
