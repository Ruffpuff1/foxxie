import { container } from '@sapphire/framework';
import { BaseEntity, Entity, ObjectIdColumn, Column, PrimaryColumn, ValueTransformer } from 'typeorm';
import type { TFunction } from 'i18next';
import type { Guild, MessageEmbedOptions, UserResolvable } from 'discord.js';

const kBigIntTransformer: ValueTransformer = {
    from: value => (!value ? value : Number(value as string)),
    to: value => (!value ? value : String(value as number))
};

@Entity('guild', { schema: 'public' })
export class GuildEntity extends BaseEntity {

    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn()
    public id!: string;

    @Column('varchar', { name: 'prefix', length: 10, default: process.env.CLIENT_PREFIX })
    public prefix = process.env.CLIENT_PREFIX;

    @Column('varchar', { name: 'language', default: 'en-US' })
    public language = 'en-US';

    @Column('boolean', { name: 'disableNaturalPrefix', default: false })
    public disableNaturalPrefix = false;

    @Column('boolean', { name: 'avatarsBoost', default: false })
    public avatarsBoost = false;

    @Column('varchar', { name: 'birthdayMessage', nullable: true, length: 200 })
    public birthdayMessage?: string | null;

    @Column('varchar', { name: 'birthdayChannel', nullable: true, length: 19 })
    public birthdayChannel?: string | null;

    @Column('varchar', { name: 'birthdayRole', nullable: true, length: 19 })
    public birthdayRole?: string | null;

    @Column('varchar', { name: 'channelsBoost', nullable: true, length: 19 })
    public channelsBoost?: string | null;

    @Column('varchar', { name: 'channelsDisboard', nullable: true, length: 19 })
    public channelsDisboard?: string | null;

    @Column('varchar', { name: 'channelsGoodbye', nullable: true, length: 19 })
    public channelsGoodbye?: string | null;

    @Column('varchar', { name: 'channelsIgnoreAll', length: 19, array: true, default: () => 'ARRAY[]::VARCHAR[]' })
    public channelsIgnoreAll: string[] = [];

    @Column('varchar', { name: 'channelsLogsMemberJoin', nullable: true, length: 19 })
    public channelsLogsMemberJoin?: string | null;

    @Column('varchar', { name: 'channelsLogsMemberLeave', nullable: true, length: 19 })
    public channelsLogsMemberLeave?: string | null;

    @Column('varchar', { name: 'channelsLogsMessageDelete', nullable: true, length: 19 })
    public channelsLogsMessageDelete?: string | null;

    @Column('varchar', { name: 'channelsLogsMessageEdit', nullable: true, length: 19 })
    public channelsLogsMessageEdit?: string | null;

    @Column('varchar', { name: 'channelsLogsModeration', nullable: true, length: 19 })
    public channelsLogsModeration?: string | null;

    @Column('varchar', { name: 'channelsWelcome', nullable: true, length: 19 })
    public channelsWelcome?: string | null;

    @Column('smallint', { name: 'colorsBoost', default: 0 })
    public colorsBoost = 0;

    @Column('boolean', { name: 'embedsBoost', default: false })
    public embedsBoost = false;

    @Column('jsonb', { name: 'embedsGoodbye', nullable: true })
    public embedsGoodbye?: null | MessageEmbedOptions;

    @Column('jsonb', { name: 'embedsWelcome', nullable: true })
    public embedsWelcome?: null | MessageEmbedOptions;

    @Column('jsonb', { name: 'highlights', default: () => "'[]'::JSONB" })
    public highlights: Highlight[] = [];

    @Column('boolean', { name: 'levelingEnabled', default: false })
    public levelingEnabled = false;

    @Column('boolean', { name: 'levelingMessagesEnabled', default: true })
    public levelingMessagesEnabled = true;

    @Column('jsonb', { name: 'levelingRoles', default: () => "'[]'::JSONB" })
    public levelingRoles: LevelingRole[] = [];

    @Column('bigint', { default: 0, transformer: kBigIntTransformer, name: 'messageCount' })
    public messageCount = 0;

    @Column('varchar', { name: 'messagesBoost', nullable: true, length: 2000 })
    public messagesBoost?: string | null;

    @Column('varchar', { name: 'messagesDisboard', nullable: true, length: 2000 })
    public messagesDisboard?: string | null;

    @Column('varchar', { name: 'messagesGoodbye', nullable: true, length: 2000 })
    public messagesGoodbye?: string | null;

    @Column('bigint', { name: 'messagesGoodbyeAutoDelete', nullable: true, transformer: kBigIntTransformer })
    public messagesGoodbyeAutoDelete?: number | null = null;

    @Column('boolean', { name: 'messagesModerationAutoDelete', default: false })
    public messagesModerationAutoDelete = false;

    @Column('varchar', { name: 'messagesWelcome', nullable: true, length: 2000 })
    public messagesWelcome?: string | null;

    @Column('bigint', { name: 'messagesWelcomeAutoDelete', nullable: true, transformer: kBigIntTransformer })
    public messagesWelcomeAutoDelete?: number | null = null;

    @Column('boolean', { name: 'moderationDm', default: true })
    public moderationDm = true;

    @Column('boolean', { name: 'moderationGiftsEnabled', default: false })
    public moderationGiftsEnabled = false;

    @Column('smallint', { name: 'moderationGiftsSoftPunish', default: 0 })
    public moderationGiftsSoftPunish = 0;

    @Column('smallint', { name: 'moderationGiftsHardPunish', default: 0 })
    public moderationGiftsHardPunish = 0;

    @Column('bigint', { name: 'moderationGiftsHardPunishDuration', nullable: true, transformer: kBigIntTransformer })
    public moderationGiftsHardPunishDuration: number | null = null;

    @Column('boolean', { name: 'moderationInvitesEnabled', default: false })
    public moderationInvitesEnabled = false;

    @Column('smallint', { name: 'moderationInvitesSoftPunish', default: 0 })
    public moderationInvitesSoftPunish = 0;

    @Column('smallint', { name: 'moderationInvitesHardPunish', default: 0 })
    public moderationInvitesHardPunish = 0;

    @Column('bigint', { name: 'moderationInvitesHardPunishDuration', nullable: true, transformer: kBigIntTransformer })
    public moderationInvitesHardPunishDuration: number | null = null;

    @Column('boolean', { name: 'permissionNodesEnabled', default: false })
    public permissionNodesEnabled = false;

    @Column('jsonb', { name: 'persistRoles', default: () => "'[]'::JSONB" })
    public persistRoles: PersistRole[] = [];

    @Column('boolean', { name: 'persistRolesEnabled', default: false })
    public persistRolesEnabled = false;

    @Column('varchar', { name: 'pingsDisboard', nullable: true })
    public pingsDisboard: string | null = null;

    @Column('jsonb', { name: 'reactionRoles', default: () => "'[]'::JSONB" })
    public reactionRoles: ReactionRole[] = [];

    @Column('varchar', { name: 'rolesMuted', nullable: true, length: 19 })
    public rolesMuted?: string | null;

    @Column('varchar', { name: 'starboardChannel', nullable: true, length: 19 })
    public starboardChannel?: string | null;

    @Column('varchar', { name: 'starboardIgnoredChannels', length: 19, array: true, default: () => 'ARRAY[]::VARCHAR[]' })
    public starboardIgnoreChannels: string[] = [];

    @Column('smallint', { name: 'starboardMinimum', default: 3 })
    public starboardMinimum = 3;

    @Column('boolean', { name: 'starboardNotifs', default: false })
    public starboardNotifs = false;

    @Column('boolean', { name: 'starboardSelfStar', default: false })
    public starboardSelfStar = false;

    @Column('jsonb', { name: 'tags', default: () => "'[]'::JSONB" })
    public tags: Tag[] = [];

    public get guild(): Guild {
        return container.client.guilds.cache.get(this.id) as Guild;
    }

    public getUserHighlight(user: UserResolvable): Highlight[] {
        const userId = container.client.users.resolveId(user);
        return this.highlights.filter(highlight => highlight.userId === userId);
    }

    public getLanguage(): TFunction {
        return container.i18n.getT(this.language);
    }

}

export interface PersistRole {
    userId: string;
    roles: string[];
}

export interface Highlight {
    word: string | RegExp;
    userId: string;
    isRegex: boolean;
}

export interface ReactionRole {
    messageId: string;
    roleId: string;
    channelId: string;
    emoji: string;
}

export interface Tag {
    id: string;
    delete: boolean;
    embed: boolean;
    color: number;
    aliases: string[];
    content: string;
}

export interface LevelingRole {
    id: string;
    points: number;
}