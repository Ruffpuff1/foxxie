import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { Permissions } from 'discord.js';

const sendMessages = new Permissions([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]);

export function isSendableChannel(channel: GuildTextBasedChannelTypes): boolean {
    if (!channel) return false;
    if (!channel.guild) return true;
    return channel.permissionsFor(channel.guild.me!).has(sendMessages);
}
