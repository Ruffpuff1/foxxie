import { container } from '@sapphire/framework';
import { Channel, ChannelResolvable, Guild, GuildResolvable } from 'discord.js';
import { ChannelUtilityService } from './ChannelUtilityService';
import { GuildUtilityService } from './Guild/GuildUtilityService';

export class UtilityService {
    #channelUtilityCache = new WeakMap<Channel, ChannelUtilityService>();

    #guildUtilityCache = new WeakMap<Guild, GuildUtilityService>();

    public channel(resolvable: ChannelResolvable): ChannelUtilityService {
        const channel = container.client.channels.resolve(resolvable);
        const previous = this.#channelUtilityCache.get(channel!);
        if (previous !== undefined) return previous;

        const entry = new ChannelUtilityService(channel!);

        this.#channelUtilityCache.set(channel!, entry);

        return entry;
    }

    /**
     * Gets the guild utilities service.
     * @param resolvable The guild resolvable.
     */
    public guild(resolvable: GuildResolvable): GuildUtilityService {
        const guild = container.client.guilds.resolve(resolvable);
        const previous = this.#guildUtilityCache.get(guild!);
        if (previous !== undefined) return previous;

        const entry = new GuildUtilityService(guild!);

        this.#guildUtilityCache.set(guild!, entry);

        return entry;
    }
}
