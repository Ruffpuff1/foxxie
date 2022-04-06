import { create } from '#utils/regexCreator';
import type { Guild } from '@prisma/client';
import { container } from '@sapphire/framework';
import type { PickByValue } from '@sapphire/utilities';
import type { APIEmbed } from 'discord-api-types/v9';
import { MessageEmbed, MessageEmbedOptions } from 'discord.js';

export class GuildModel {
    public id: string;

    public autoroles: string[];

    public botroles: string[];

    public channelsBoost: string | null;

    public channelsDisboard: string | null;

    public channelsGoodbye: string | null;

    public channelsIgnoreAll: string[];

    public channelsLogsDisboard: string | null;

    public channelsLogsFilterInvites: string | null;

    public channelsLogsFilterWords: string | null;

    public channelsLogsMemberJoin: string | null;

    public channelsLogsMemberLeave: string | null;

    public channelsLogsMemberScreening: string | null;

    public channelsLogsMessageDelete: string | null;

    public channelsLogsMessageEdit: string | null;

    public channelsLogsModeration: string | null;

    public channelsLogsRoleUpdate: string | null;

    public channelsStatsMemberCountChannel: string | null;

    public channelsStatsMemberCountCompact: boolean;

    public channelsStatsMemberCountTemplate: string | null;

    public channelsWelcome: string | null;

    public commandChannels: string[];

    public disabledChannels: string[];

    public disboardCommands: string[];

    public embedsBoost: MessageEmbed | null;

    public embedsDisboard: MessageEmbed | null;

    public embedsGoodbye: MessageEmbed | null;

    public embedsWelcome: MessageEmbed | null;

    public eventsBanAdd: boolean;

    public eventsBanRemove: boolean;

    public eventsKick: boolean;

    public eventsMuteAdd: boolean;

    public eventsMuteRemove: boolean;

    public language: 'en-US' | 'es-MX';

    public messageCount: number;

    public messagesBoost: string | null;

    public messagesDisboard: string | null;

    public messagesGoodbye: string | null;

    public messagesGoodbyeAutoDelete: number;

    public messagesModerationAutoDelete: boolean;

    public messagesWelcomeAutoDelete: number;

    public moderationChannelsIgnoreAll: string[];

    public moderationDm: boolean;

    public moderationGiftsEnabled: boolean;

    public moderationGiftsSoftPunish: number;

    public moderationGiftsHardPunish: number;

    public moderationGiftsHardPunishDuration: number | null;

    public moderationInvitesEnabled: boolean;

    public moderationInvitesSoftPunish: number;

    public moderationInvitesHardPunish: number;

    public moderationInvitesHardPunishDuration: number | null;

    public moderationScamsEnabled: boolean;

    public moderationScamsSoftPunish: number;

    public moderationScamsHardPunish: number;

    public moderationScamsHardPunishDuration: number | null;

    public persistRolesEnabled: boolean;

    public raidChannel: string | null;

    public rolesMuted: string | null;

    public words: Word[];

    public constructor(data: Partial<Guild>) {
        for (const key of this.keys()) {
            switch (key) {
                case 'id': {
                    this.id = data.guildId!;
                    continue;
                }
                case 'embedsBoost':
                case 'embedsDisboard':
                case 'embedsGoodbye':
                case 'embedsWelcome': {
                    this.setEmbed(key, data[key] as APIEmbed);
                    continue;
                }
            }

            // @ts-expect-error keys not allowed
            this[key] = data[key as keyof Guild];
        }
    }

    public getLanguage() {
        return container.i18n.getT(this.language);
    }

    private keys() {
        return Object.keys(this);
    }

    private setEmbed(key: PickByValue<GuildModel, MessageEmbed | null>, value: APIEmbed | null) {
        if (value === null) {
            this[key] = value;
            return;
        }
        const embed = new MessageEmbed(value as MessageEmbedOptions);
        this[key] = embed;
    }

    public get wordFilterRegExp() {
        return this.words.length ? create(this.words.map(en => en.word)) : null;
    }
}

export interface Word {
    word: string;
    softPunish: number;
    hardPunish: number;
    hardPunishDuration: number | null;
}
