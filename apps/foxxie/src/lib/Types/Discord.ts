import type { CommandInteraction, EmbedBuilder, Guild, GuildMember, Message, OmitPartialGroupDMChannel } from 'discord.js';

export type DMMessage = Message<false>;
export interface GuildInteraction extends CommandInteraction {
	guild: Guild;
}
export type GuildMessage = { member: GuildMember } & Message<true>;

export type NonGroupMessage = OmitPartialGroupDMChannel<Message<boolean>>;

export type PartialModerationEntityWithRoleIdExtraData = { extraData: { roleId: string } } & Partial<object>;

export type TypeOfEmbed = EmbedBuilder;
