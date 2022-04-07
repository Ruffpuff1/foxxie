import { Listener, ListenerOptions } from '@sapphire/framework';
import { resolveToNull, isOnServer, isTCS } from 'lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { guildSettings, aquireSettings } from 'lib/database';
import type { Guild } from 'discord.js';
import type { TFunction } from '@sapphire/plugin-i18next';
import { languageKeys } from 'lib/i18n';
import { PermissionFlagsBits } from 'discord-api-types/v9';

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer()
})
export class FoxxieListener extends Listener {

    async run(guild: Guild, t: TFunction): Promise<void> {
        if (!guild.me.permissions.has(PermissionFlagsBits.ManageChannels)) return;

        const channelId = await aquireSettings(guild, guildSettings.channels.stats.memberCount);
        if (!channelId) return;

        const channel = await resolveToNull(guild.channels.fetch(channelId));
        if (!channel) return;

        const memberCount = t(languageKeys.globals.numberFormat, { value: guild.memberCount });

        await channel.setName(
            isTCS(guild)
                ? `🥤 ┇𝐌𝐞𝐦𝐛𝐞𝐫𝐬・ ${memberCount}`
                : `Members: ${memberCount}`
        );
    }

}