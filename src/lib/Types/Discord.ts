import type { CommandInteraction, EmbedBuilder, Guild, GuildMember, Message, OmitPartialGroupDMChannel } from 'discord.js';

export type GuildMessage = Message<true> & { member: GuildMember };
export type DMMessage = Message<false>;
export type NonGroupMessage = OmitPartialGroupDMChannel<Message<boolean>>;

export interface GuildInteraction extends CommandInteraction {
	guild: Guild;
}

export type TypeOfEmbed = EmbedBuilder;

export type PartialModerationEntityWithRoleIdExtraData = Partial<object> & { extraData: { roleId: string } };
