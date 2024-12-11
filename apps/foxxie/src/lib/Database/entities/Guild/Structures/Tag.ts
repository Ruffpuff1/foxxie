import { resolveClientColor } from '#utils/util';
import { EmbedBuilder, Message } from 'discord.js';

export class Tag {
	public aliases!: string[];

	public color!: number;

	public content!: string;

	public delete!: boolean;

	public embed!: boolean;

	public id!: string;

	public constructor(data: Partial<Tag>) {
		Object.assign(this, data);
	}

	public async buildEmbed(message: Message) {
		return new EmbedBuilder()
			.setDescription(this.content)
			.setColor(await resolveClientColor(message.guild, this.color || message.member?.displayColor));
	}
}
