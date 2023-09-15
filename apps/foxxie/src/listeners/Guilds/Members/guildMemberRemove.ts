import { GuildSettings, acquireSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { AutomationListener } from '#lib/Structures';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { fetchChannel } from '#utils/Discord';
import { floatPromise } from '#utils/util';
import { cast, isDev, resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { GuildMember } from 'discord.js';

@ApplyOptions<AutomationListener.Options>({
    event: FoxxieEvents.GuildMemberRemove,
    enabled: !isDev()
})
export class UserAutomationAutomationListener extends AutomationListener<FoxxieEvents.GuildMemberRemove> {
    public async run(...[member]: EventArgs<FoxxieEvents.GuildMemberRemove>): Promise<void> {
        const [message, embed, timer, persist, t] = await acquireSettings(member.guild, settings => [
            settings[GuildSettings.Messages.Goodbye],
            settings[GuildSettings.Embeds.Goodbye],
            settings[GuildSettings.Messages.AutoDelete.Goodbye],
            settings[GuildSettings.PersistRoles],
            settings.getLanguage()
        ]);

        if (persist) {
            const { persistRoles } = this.container.utilities.guild(member.guild);
            await Promise.all(
                member.roles.cache
                    .filter(role => role.id !== member.guild.id)
                    .map(async role => persistRoles.add(member.id, role.id))
            );
        }

        const channel = await fetchChannel(member.guild, GuildSettings.Channels.Goodbye);
        if (!channel) return;

        /* retrive content */
        const [embeds, content] = this.retriveAutomationContent(
            cast<GuildMember>(member),
            t,
            message,
            embed,
            t(LanguageKeys.Listeners.Events.GoodbyeDefault)
        );

        const sent = await resolveToNull(channel.send({ content, embeds }));
        /* if timer set, and successfully sent. set a timer to delete */
        if (sent && timer) setTimeout(() => floatPromise(sent.delete()), timer);
    }
}
