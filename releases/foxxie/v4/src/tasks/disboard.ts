import { languageKeys } from '../lib/i18n';
import { Task, aquireSettings, guildSettings, ResponseType, PartialResponseValue } from '../lib/database';
import { FoxxieEmbed } from '../lib/discord';
import { isTCS, Urls, resolveToNull, BrandingColors, isOnServer } from '../lib/util';
import type { Guild, RoleMention, TextChannel } from 'discord.js';
import type { TFunction } from '@sapphire/plugin-i18next';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Task.Options>({
    enabled: isOnServer()
})
export default class FoxxieTask extends Task {

    async run({ guildId }: DisboardTaskData): Promise<PartialResponseValue> {
        const guild = this.container.client.guilds.cache.get(guildId);
        if (!guild) return { type: ResponseType.Finished };

        if (!guild.available) return { type: ResponseType.Delay, value: 20000 };

        await this.message(guild);
        return { type: ResponseType.Finished };
    }

    async message(guild: Guild): Promise<void> {
        const { channels, name, id, me, roles } = guild;
        const [channelId, message, roleId, t] = await aquireSettings(guild, settings => {
            return [
                settings[guildSettings.channels.disboard],
                settings[guildSettings.messages.disboard],
                settings[guildSettings.pings.disboard],
                settings.getLanguage()
            ];
        });

        if (!channelId) return;
        const channel = await resolveToNull(channels.fetch(channelId));
        if (!channel) return;

        const keys = (t as TFunction)(languageKeys.tasks.disboard);
        const role = roles.cache.get(roleId);

        let text: string | RoleMention | undefined = role ? role.toString() : undefined;
        if (isTCS(guild)) text = `**Heya ${role!.toString()} it's time to bump the server.**`;

        const embed = new FoxxieEmbed(guild)
            .setColor(me?.displayColor || BrandingColors.Primary)
            .setAuthor(keys.title, guild.iconURL({ dynamic: true })!, `${Urls.Disboard}server/${id}`)
            .setThumbnail(this.container.client.user!.displayAvatarURL({ dynamic: true }))
            .setDescription((message || keys.default).replace(/{(server|guild)}/gi, name));

        await (channel as TextChannel).send({ content: text, embeds: [embed], allowedMentions: { parse: ['roles'] } });
    }

}

interface DisboardTaskData {
    guildId: string
}