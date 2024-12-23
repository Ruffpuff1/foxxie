import { FTFunction } from '#lib/types';
import { ColorResolvable, EmbedAuthorOptions, EmbedBuilder, EmbedFooterOptions, MessageCreateOptions } from 'discord.js';

export class FoxxieBuilder {
	public content: null | string = null;

	public embeds: EmbedBuilder[] = [];

	protected embed: EmbedBuilder;

	public constructor(public t: FTFunction) {
		this.embed = new EmbedBuilder();
	}

	public build(): MessageCreateOptions {
		this.embeds.push(this.embed);
		return {
			content: this.content!,
			embeds: this.embeds
		};
	}

	public setAuthor(options: EmbedAuthorOptions | null) {
		this.embed.setAuthor(options);
		return this;
	}

	public setColor(color: ColorResolvable | null) {
		this.embed.setColor(color);
		return this;
	}

	public setContent(content: null | string) {
		this.content = content;
		return this;
	}

	public setDescription(description: null | string | string[], joiner = '\n') {
		this.embed.setDescription(Array.isArray(description) ? description.join(joiner) : description);
		return this;
	}

	public setFooter(options: EmbedFooterOptions | null) {
		this.embed.setFooter(options);
		return this;
	}

	public setTimestamp(timestamp?: Date | null | number) {
		this.embed.setTimestamp(timestamp);
		return this;
	}
}
