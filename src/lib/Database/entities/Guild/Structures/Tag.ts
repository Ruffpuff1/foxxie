import { resolveClientColor } from '#utils/util';
import { EmbedBuilder, Message } from 'discord.js';

export class Tag {
	public id!: string;

	public delete!: boolean;

	public embed!: boolean;

	public aliases!: string[];

	public content!: string;

	public color!: number;

	public constructor(data: Partial<Tag>) {
		Object.assign(this, data);
	}

	public buildEmbed(message: Message) {
		return new EmbedBuilder()
			.setDescription(this.content)
			.setColor(resolveClientColor(message.guild, this.color || message.member?.displayColor));
	}
}
