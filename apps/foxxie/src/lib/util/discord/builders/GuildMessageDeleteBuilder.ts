import { container } from '@sapphire/pieces';
import { cutText, isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { GuildMessage } from '#lib/types';
import { getContent, getFullEmbedAuthor, getImages, setMultipleEmbedImages } from '#utils/util';
import { Colors, GuildTextBasedChannel, User } from 'discord.js';

import { FoxxieBuilder } from './base/FoxxieBuilder.js';

export class GuildMessageDeleteBuilder extends FoxxieBuilder {
	public channel: GuildTextBasedChannel | null = null;

	public message: GuildMessage | null = null;

	public moderator: null | User = null;

	public reason: null | string = null;

	public construct() {
		this.setColor(Colors.Red).setTimestamp();

		if (isNullish(this.message)) {
			this.setFooter({ text: `Unknown Message Deleted` }).setAuthor(getFullEmbedAuthor(container.client.user!));
			return { embeds: [this.embed] };
		}

		this.setAuthor(getFullEmbedAuthor(this.message.member || this.message.author, this.message.url)).setFooter({ text: `Message Deleted` });

		const urls = this.#resolveDescription();
		const embeds = setMultipleEmbedImages(this.embed, urls);
		return { embeds };
	}

	public setChannel(channel: GuildTextBasedChannel | null | undefined) {
		this.channel = channel || null;
		return this;
	}

	public setMessage(message: GuildMessage | null | undefined) {
		this.message = message || null;
		return this;
	}

	public setModerator(moderator: null | undefined | User) {
		this.moderator = moderator || null;
		return this;
	}

	public setReason(reason: null | string | undefined) {
		this.reason = reason || null;
		return this;
	}

	#resolveDescription() {
		const content = getContent(this.message!);
		const description: string[] = [];

		if (this.moderator) description.push(`**Moderator**: \`${this.moderator.username}\` (${this.moderator.id})`);

		if (this.channel) description.push(`**Location**: ${this.channel.name} (${this.channel.id})`);
		if (this.reason) description.push(`**Reason**: ${cutText(this.reason, 50)}`);

		if (!isNullishOrEmpty(content)) description.push(`**Content**: ${cutText(content, 1700)}`);
		const urls = [...getImages(this.message!)];
		if (urls.length) description.push(`**Images**:`);
		this.setDescription(description.join('\n'));

		return urls;
	}
}
