import type { FoxxieEmbed } from '#lib/discord';
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import type { Guild, GuildMember, Interaction, Message, MessageEmbed } from 'discord.js';

export interface GuildMessage extends Message {
    channel: GuildTextBasedChannelTypes;
    readonly guild: Guild;
    readonly member: GuildMember;
}

export interface GuildInteraction extends Interaction {
    guild: Guild;
}

export type TypeOfEmbed = MessageEmbed | FoxxieEmbed;
