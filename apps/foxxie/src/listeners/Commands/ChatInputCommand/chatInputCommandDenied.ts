import { Listener } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { translate } from '#lib/i18n';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { floatPromise } from '#utils/util';
import { ChatInputCommandInteraction } from 'discord.js';

export class UserListener extends Listener<FoxxieEvents.ChatInputCommandDenied> {
	public async run(...[error, { command, interaction }]: EventArgs<FoxxieEvents.ChatInputCommandDenied>) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(error.context), 'silent')) {
			if (interaction.deferred || interaction.replied) await floatPromise(interaction.deleteReply());
			return;
		}

		const identifier = translate(error.identifier);
		return this.alert(interaction, await resolveKey(interaction, identifier, { command, interaction, ...(error.context as object) }));
	}

	private alert(interaction: ChatInputCommandInteraction, content: string) {
		return interaction.replied ? interaction.editReply({ components: [], content, embeds: [] }) : interaction.reply({ content, ephemeral: true });
	}
}
