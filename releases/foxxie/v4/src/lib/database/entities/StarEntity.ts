import { getAllContent, Colors, isTCS, BrandingColors, resolveToNull, getImage } from '../../util';
import { FoxxieEmbed } from '../../discord';
import { debounce, isNullish } from '@sapphire/utilities';
import { container } from '@sapphire/framework';
import { BaseEntity, Entity, ObjectIdColumn, Column, PrimaryColumn } from 'typeorm';
import type { TFunction } from 'i18next';
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { Guild, DiscordAPIError, HTTPError } from 'discord.js';
import type { GuildMessage } from '../../types/Discord';
import { RESTJSONErrorCodes, APIUser } from 'discord-api-types/v9';
import type { StarboardManager } from '../../structures/managers';
import { aquireSettings, GuildEntity, guildSettings, writeSettings } from '..';
import { api } from '../../discord/Api';
import { languageKeys } from '../../i18n';

@Entity('starboard', { schema: 'public' })
export class StarEntity extends BaseEntity {

    #users = new Set<string>();
    #manager: StarboardManager = null!;
    #message: GuildMessage = null!;
    #starMessage: GuildMessage | null = null;
    // eslint-disable-next-line no-invalid-this
    #updateStarMessage = debounce(this.updateStarMessage.bind(this), { wait: 2500, maxWait: 10000 });

    @ObjectIdColumn()
    public _id!: string;

    @Column('boolean')
    public enabled = true;

    @Column('varchar', { length: 19 })
    public userId: string = null!;

    @PrimaryColumn('varchar', { length: 19 })
    public messageId: string = null!;

    @Column('varchar', { length: 19 })
    public channelId: string = null!;

    @PrimaryColumn('varchar', { length: 19 })
    public guildId: string = null!;

    @Column('varchar', { nullable: true, length: 19 })
    public starMessageId: string | null = null;

    @Column('integer')
    public stars = 0;

    public lastUpdated = Date.now();

    get color(): number {
        return isTCS(this.#message.guild as Guild)
            ? Colors.TheCornerStoreStarboard
            : this.#message.member?.displayColor || this.#message.guild?.me?.displayColor || BrandingColors.Primary;
    }

    get formattedStars(): string {
        return `${this.emoji} **${this.stars || 3}**`;
    }

    get emoji(): string {
        const { stars } = this;
        if (!stars) return '⭐';
        if (stars < 5) return '⭐';
        if (stars < 10) return '🌟';
        if (stars < 15) return '💫';
        if (stars < 20) return '✨';
        if (stars < 25) return '🌠';
        return '🌌';
    }

    public setup(manager: StarboardManager): void {
        this.#manager = manager;
    }

    public init(manager: StarboardManager, message: GuildMessage): StarEntity {
        this.setup(manager);
        this.#message = message;
        this.messageId = message.id;
        this.channelId = message.channel.id;
        this.guildId = manager.guild.id;
        this.userId = message.author.id;
        return this;
    }

    public async disable(): Promise<boolean> {
        if (!this.enabled) return false;
        await this.edit({ enabled: false });
        return true;
    }

    public async enable(): Promise<boolean> {
        if (this.enabled) return false;
        await this.edit({ enabled: true });
        await this.downloadUserList();
        return true;
    }

    public async increment(id: string, self: boolean): Promise<void> {
        if (this.#message.author.id === id && !self) return;
        this.#users.add(id);
        await this.edit({ stars: this.#users.size });
    }

    public async decrement(id: string): Promise<void> {
        this.#users.delete(id);
        await this.edit({ stars: this.#users.size });
    }

    public async edit(options: Partial<StarEntity>): Promise<this> {
        this.lastUpdated = Date.now();

        const previous = this.#manager.syncMessages.get(this);
        if (previous) await previous;

        if (Reflect.has(options, 'enabled')) {
            this.enabled = options.enabled!;
        }
        if (Reflect.has(options, 'stars') && this.enabled) {
            this.stars = options.stars!;
            await this.#updateStarMessage();
        }

        await this.save();
        return this;
    }

    public remove(): Promise<this> {
        this.enabled = false;
        this.#manager.delete(this.messageId);
        return super.remove();
    }

    public async downloadStarMessage(): Promise<void> {
        if (!this.starMessageId) return;

        const channelId = await aquireSettings(this.#message.guild, guildSettings.starboard.channel);
        if (!channelId) return;

        const channel = await resolveToNull(this.#message.guild.channels.fetch(channelId)) as GuildTextBasedChannelTypes | null;
        if (!channel) {
            await writeSettings(this.#message.guild, (settings: GuildEntity) => settings[guildSettings.starboard.channel] = null);
            return;
        }

        try {
            this.#starMessage = (await channel.messages.fetch(this.starMessageId)) as GuildMessage;
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.remove();
            }
        }
    }

    public async downloadUserList(): Promise<void> {
        try {
            const self = await aquireSettings(this.#message.guild, guildSettings.starboard.self);
            this.#users = await this.fetchReactionUsers(this.#message.channel.id, this.#message.id, '⭐');

            if (!self) this.#users.delete(this.#message.author.id);
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.remove();
                return;
            }
        }

        if (!this.#users.size) {
            await this.remove();
            return;
        }

        this.stars = this.#users.size;
    }

    public async fetchReactionUsers(channelId: string, messageId: string, reaction: string): Promise<Set<string>> {
        const users: Set<string> = new Set();
        let rawUsers: APIUser[] = [];

        do {
            rawUsers = await api()
                .channels(channelId)
                .messages(messageId)
                .reactions(reaction)
                .get<APIUser[]>({ query: { limit: 100, after: rawUsers.length ? rawUsers[rawUsers.length - 1].id : undefined } });
            for (const user of rawUsers) users.add(user.id);
        } while (rawUsers.length === 100);

        return users;
    }

    private getEmbed(t: TFunction): FoxxieEmbed {
        const message = this.#message;
        const member = this.#manager.guild.members.cache.get(message.author.id);

        return new FoxxieEmbed(message)
            .setAuthor(message.author.tag, member?.displayAvatarURL({ dynamic: true }))
            .setColor(this.color)
            .setDescription(this.getContent(t))
            .setImage(getImage(message)!);
    }

    private getContent(t: TFunction): string {
        const url = `[${t(languageKeys.listeners.starboardJumpTo)}](${this.#message.url})`;
        return [
            `${getAllContent(this.#message)}\n`,
            `${this.formattedStars} | ${this.#message.channel.toString()} | ${url}`
        ].join('\n');
    }

    private async updateStarMessage(): Promise<void> {
        const [minimum, channelId, t] = await aquireSettings(this.#message.guild, (settings: GuildEntity) => [
            settings[guildSettings.starboard.minimum],
            settings[guildSettings.starboard.channel],
            settings.getLanguage()
        ]);

        if (this.stars < minimum || isNullish(channelId)) return;

        if (this.#starMessage) {
            try {
                const embed = this.getEmbed(t);
                await this.#starMessage.edit({ embeds: [embed] });
            } catch (error) {
                if (!(error instanceof DiscordAPIError) || !(error instanceof HTTPError)) return;

                if (error.code === RESTJSONErrorCodes.MissingAccess) return;
                if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.edit({ starMessageId: null, enabled: false });
            }

            return;
        }

        const channel = this.#message.guild.channels.cache.get(channelId) as GuildTextBasedChannelTypes | undefined;
        if (!channel) return;

        const embed = this.getEmbed(t);
        const promise = channel
            .send({ embeds: [embed] })
            .then(message => {
                this.#starMessage = message as GuildMessage;
                message.react(this.emoji);
                this.starMessageId = message.id;
                this.save();
            })
            .catch(error => {
                if (!(error instanceof DiscordAPIError) || !(error instanceof HTTPError)) return;

                if (error.code === RESTJSONErrorCodes.MissingAccess) return;
                // Emit to console
                container.logger.fatal(error);
            })
            .finally(() => this.#manager.syncMessages.delete(this));

        this.#manager.syncMessages.set(this, promise);
        await promise;
    }

}