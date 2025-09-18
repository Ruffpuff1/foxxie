import { ApplicationCommandRegistry, container } from '@sapphire/framework';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';
import { Stopwatch } from '@sapphire/stopwatch';
import { getT } from '#lib/i18n';

import { LanguageKeys } from '../Resources/Intl/index.js';
import { FoxxieCommand } from '../Structures/index.js';

const Root = LanguageKeys.Commands.General.Ping;

export class ChatInputPing {
	public static async ChatInputPing(...[interaction]: FoxxieCommand.ChatInputRunArgs) {
		const t = getT('en-US');

		const stopwatch = new Stopwatch().start();
		await container.prisma.guilds.findFirst();
		stopwatch.stop();

		const content = t(LanguageKeys.Commands.General.Ping.Pong, {
			context: 'slash',
			dbPing: stopwatch.toString()
		});

		await interaction.reply(content);
	}

	public static Register(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => applyLocalizedBuilder(builder, Root.Name, Root.Description));
	}
}
