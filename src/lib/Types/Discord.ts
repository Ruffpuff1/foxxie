import type { CommandInteraction, EmbedBuilder, Guild, GuildMember, Message } from 'discord.js';

export interface GuildMessage extends Message<true> {
    readonly guild: Guild;
    readonly member: GuildMember;
}

export interface GuildInteraction extends CommandInteraction {
    guild: Guild;
}

export type TypeOfEmbed = EmbedBuilder;

export type PartialModerationEntityWithRoleIdExtraData = Partial<{}> & { extraData: { roleId: string } };
