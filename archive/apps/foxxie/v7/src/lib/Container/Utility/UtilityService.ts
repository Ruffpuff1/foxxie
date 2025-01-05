import { container } from '@sapphire/pieces';
import { Channel, ChannelResolvable, Guild, GuildResolvable } from 'discord.js';
import { AutoCompleteCommandsService } from './AutoCompleteCommands/AutoCompleteCommands';
import { ChannelUtilityService } from './ChannelUtilityService';
import { ChatInputCommandsService } from './ChatInputCommands/ChatInputCommands';
import { GuildUtilityService } from './Guild/GuildUtilityService';
import { SubCommandsService } from './SubCommands/SubCommands';
import { TextCommandsService } from './TextCommands/TextCommands';

export class UtilityService {
    #channelUtilityCache = new WeakMap<Channel, ChannelUtilityService>();

    #guildUtilityCache = new WeakMap<Guild, GuildUtilityService>();

    public autoCompleteCommands = new AutoCompleteCommandsService();

    public chatInputCommands = new ChatInputCommandsService();

    public subCommands = new SubCommandsService();

    public textCommands = new TextCommandsService();

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
