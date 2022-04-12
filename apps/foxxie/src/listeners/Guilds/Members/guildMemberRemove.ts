import { Events, EventArgs } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { GuildSettings } from '#lib/database';
import { fetchChannel, getPersistRoles } from '#utils/Discord';
import { AutomationListener } from '#lib/structures';
import type { GuildMember } from 'discord.js';
import { LanguageKeys } from '#lib/i18n';
import { resolveToNull } from '@ruffpuff/utilities';
import { floatPromise } from '#utils/util';

@ApplyOptions<AutomationListener.Options>({
    event: Events.GuildMemberRemove
})
export class UserAutomationAutomationListener extends AutomationListener<Events.GuildMemberRemove> {
    public async run(...[member]: EventArgs<Events.GuildMemberRemove>): Promise<void> {
        const [message, embed, timer, persist, t] = await this.container.prisma.guilds(member.guild.id, settings => [
            settings[GuildSettings.Messages.Goodbye],
            settings[GuildSettings.Embeds.Goodbye],
            settings[GuildSettings.Messages.AutoDelete.Goodbye],
            // TODO persist roles
            [],
            settings.getLanguage()
        ]);

        if (persist) {
            const persistRoles = getPersistRoles(member.guild);
            await Promise.all(member.roles.cache.filter(role => role.id !== member.guild.id).map(async role => persistRoles.add(member.id, role.id)));
        }
        /* emit member count event */
        this.container.client.emit(Events.StatsMemberCount, member.guild, t);

        const channel = await fetchChannel(member.guild, GuildSettings.Channels.Goodbye);
        if (!channel) return;

        /* retrive content */
        const [embeds, content] = this.retriveAutomationContent(member as GuildMember, t, message, embed, t(LanguageKeys.Listeners.Events.GoodbyeDefault));

        const sent = await resolveToNull(channel.send({ content, embeds }));
        /* if timer set, and successfully sent. set a timer to delete */
        if (sent && timer) setTimeout(() => floatPromise(sent.delete()), timer);
    }
}
