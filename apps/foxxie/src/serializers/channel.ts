import type { Channel } from 'discord.js';

import { ApplyOptions } from '@sapphire/decorators';
import { isCategoryChannel, isGuildBasedChannelByGuildKey, isNewsChannel, isTextChannel, isVoiceChannel } from '@sapphire/discord.js-utilities';
import { type Awaitable, isNullish } from '@sapphire/utilities';
import { Serializer } from '#lib/Database/settings/structures/Serializer';

@ApplyOptions<Serializer.Options>({
	aliases: ['guildTextChannel', 'guildVoiceChannel', 'guildCategoryChannel', 'sendableChannel'] satisfies SerializerType[]
})
export class UserSerializer extends Serializer<string> {
	public isValid(value: string, context: Serializer.UpdateContext): Awaitable<boolean> {
		const channel = context.guild.channels.cache.get(value);
		return !isNullish(channel) && this.isValidChannel(channel, context.entry.type as SerializerType);
	}

	public async parse(args: Serializer.Args, { entry }: Serializer.UpdateContext) {
		const result = await args.pickResult(entry.type as SerializerType);
		return result.match({
			err: (error) => this.errorFromArgument(args, error),
			ok: (value) => this.ok(value.id)
		});
	}

	/**
	 * The stringify method to be overwritten in actual Serializers
	 * @param value The data to stringify
	 * @param guild The guild given for context in this call
	 */
	public override stringify(value: string, context: Serializer.UpdateContext): string {
		return context.guild.channels.cache.get(value)?.name ?? value;
	}

	private isValidChannel(channel: Channel, type: SerializerType): boolean {
		if (!isGuildBasedChannelByGuildKey(channel)) return false;

		console.log(channel);

		switch (type) {
			case 'guildCategoryChannel':
				return isCategoryChannel(channel);
			case 'guildTextChannel':
				return isTextChannel(channel) || isNewsChannel(channel);
			case 'guildVoiceChannel':
				return isVoiceChannel(channel);
			case 'sendableChannel':
				return channel.isSendable();
			default:
				return false;
		}
	}
}

type SerializerType = 'guildCategoryChannel' | 'guildTextChannel' | 'guildVoiceChannel' | 'sendableChannel';
