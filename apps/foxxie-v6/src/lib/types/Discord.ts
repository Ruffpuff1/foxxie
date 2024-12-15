import type { ModerationEntity } from '#lib/database';
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import type { CommandInteraction, Guild, GuildMember, Message, MessageEmbed } from 'discord.js';

export interface GuildMessage extends Message {
    channel: GuildTextBasedChannelTypes;
    readonly guild: Guild;
    readonly member: GuildMember;
}

export interface GuildInteraction extends CommandInteraction {
    guild: Guild;
}

export type TypeOfEmbed = MessageEmbed;

export type PartialModerationEntityWithRoleIdExtraData = Partial<ModerationEntity> & { extraData: { roleId: string } };
