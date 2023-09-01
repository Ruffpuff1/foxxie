import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { AutomationListener } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { fetchChannel, getPersistRoles, maybeMe } from '#utils/Discord';
import { floatPromise } from '#utils/util';
import { isDev, resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import type { GuildMember } from 'discord.js';

@ApplyOptions<AutomationListener.Options>({
    event: FoxxieEvents.GuildMemberJoin,
    enabled: !isDev()
})
export class UserListener extends AutomationListener<FoxxieEvents.GuildMemberJoin> {
    public async run(...[member, settings]: EventArgs<FoxxieEvents.GuildMemberJoin>): Promise<void> {
        const [message, embed, timer, shouldPersist, auto, bot, t] = [
            settings[GuildSettings.Messages.Welcome],
            settings[GuildSettings.Embeds.Welcome],
            settings[GuildSettings.Messages.AutoDelete.Welcome],
            settings[GuildSettings.Roles.PersistEnabled],
            settings[GuildSettings.Roles.Auto],
            settings[GuildSettings.Roles.Bot],
            settings.getLanguage()
        ];

        await this.addRoles(member, shouldPersist, auto, bot);

        const channel = await fetchChannel(member.guild, GuildSettings.Channels.Welcome);
        if (!channel) return;

        const [embeds, content] = this.retriveAutomationContent(
            member,
            t,
            message,
            embed,
            t(LanguageKeys.Listeners.Events.WelcomeDefault)
        );
        const sent = await resolveToNull(channel.send({ embeds, content, allowedMentions: { parse: ['roles', 'users'] } }));

        if (sent && timer) setTimeout(() => floatPromise(sent.delete()), timer);
    }

    private async addRoles(member: GuildMember, persist: boolean, auto: string[], bot: string[]) {
        if (persist) await this.managePersistRoles(member);
        if (auto.length || bot.length) await this.addAutoRoles(member, auto, bot);
    }

    private async addAutoRoles(member: GuildMember, auto: string[], bot: string[]) {
        for (const id of member.user.bot ? bot : auto) {
            if (member.roles.cache.has(id)) continue;
            await floatPromise(member.roles.add(id));
        }
    }

    private async managePersistRoles(member: GuildMember) {
        if (!maybeMe(member.guild)?.permissions.has(PermissionFlagsBits.ManageRoles)) return;

        const roles = await getPersistRoles(member).fetch(member.id);
        if (!roles.length) return;

        for (const id of roles) await floatPromise(member.roles.add(id));
    }
}
