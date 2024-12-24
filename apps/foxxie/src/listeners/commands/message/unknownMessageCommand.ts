import { Listener } from '@sapphire/framework';
import { readSettings, Tag } from '#lib/database';
import { EventArgs, FoxxieEvents, GuildMessage } from '#lib/types';
import { deleteMessage, resolveClientColor, sendMessage } from '#utils/functions';
import { ColorResolvable, EmbedBuilder, Message } from 'discord.js';

export class UserListener extends Listener<FoxxieEvents.UnknownMessageCommand> {
	public async run(...[{ commandName, message }]: EventArgs<FoxxieEvents.UnknownMessageCommand>): Promise<void> {
		if (!message.inGuild()) return;
		const { tags } = await readSettings(message.guildId);

		const foundTag = tags.find((tag) => tag.id === commandName || tag.aliases.includes(commandName));
		if (!foundTag) return;

		const { content } = foundTag;

		if (foundTag.embed) {
			const embed = await this.#buildEmbed(foundTag as Tag, message);
			await sendMessage(message as GuildMessage, embed);

			if (foundTag.delete) await deleteMessage(message);
			return;
		}

		await sendMessage(message as GuildMessage, content);
		if (foundTag.delete) await deleteMessage(message);
	}

	async #buildEmbed(tag: Tag, message: Message) {
		return new EmbedBuilder()
			.setDescription(tag.content)
			.setColor(await resolveClientColor(message, (tag.color || message.member!.displayColor) as ColorResolvable));
	}
}
