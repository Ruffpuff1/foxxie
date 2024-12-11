import { FoxxieCommand } from '#lib/structures';
import { Emojis } from '#utils/constants';
import { getModeration } from '#utils/functions';
import { TypeVariation } from '#utils/moderationConstants';
import { send } from '@sapphire/plugin-editable-commands';
import { Message } from 'discord.js';

export class UserCommand extends FoxxieCommand {
	public async messageRun(msg: Message): Promise<void> {
		const moderation = getModeration(msg.guild!);

		await send(msg, `${Emojis.Loading} Fetching moderation cases of this server.`);
		const cases = await moderation.fetch();
		const filtered = cases;

		let edited = 0;
		const total = filtered.size;
		await send(msg, `${Emojis.Loading} Editing moderation cases of this server: **${edited}/${total}** completed.`);

		for (const entry of filtered.values()) {
			await moderation.edit(entry);
			edited++;
			await send(msg, `${Emojis.Loading} Editing moderation cases of this server: **${edited}/${total}** completed.`);
		}

		await send(msg, `${Emojis.Success} Completed editing **${total}** moderation cases.`);
	}

	public override async chatInputRun(interaction: FoxxieCommand.ChatInputCommandInteraction): Promise<void> {
		const moderation = getModeration(interaction.guild!);

		await interaction.deferReply();
		const cases = await moderation.fetch();
		const filtered = cases.filter((c) => [TypeVariation.Lock, TypeVariation.Prune].includes(c.type));

		let edited = 0;
		const total = filtered.size;
		await interaction.editReply(`${Emojis.Loading} Editing moderation cases of this server: **${edited}/${total}** completed.`);

		for (const entry of filtered.values()) {
			await moderation.edit(entry);
			edited++;
			await interaction.editReply(`${Emojis.Loading} Editing moderation cases of this server: **${edited}/${total}** completed.`);
		}

		await interaction.editReply(`${Emojis.Success} Completed editing **${total}** moderation cases.`);
	}
}
