import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { chunk } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { Schedules } from '#utils/constants';
import { resolveClientColor, resolveDescription, resolveFooter, sendLoadingMessage, sendMessage } from '#utils/functions';
import { fetchTasks } from '#utils/util';
import { EmbedBuilder, Message } from 'discord.js';

import { mapBirthday } from './util.js';

export class BirthdayBuilder {
	public static async List(args: FoxxieCommand.Args): Promise<Message | PaginatedMessage> {
		const message = args.message as GuildMessage;

		const loading = await sendLoadingMessage(message);
		const tasks = fetchTasks(Schedules.Birthday, (task) => task.data.guildId === message.guild.id);

		if (!tasks.length) {
			return sendMessage(message, args.t(LanguageKeys.Commands.Configuration.Birthday.ListNone, { prefix: args.commandContext.commandPrefix }));
		}

		const template = new EmbedBuilder()
			.setColor(await resolveClientColor(message, message.member.displayColor))
			.setAuthor({
				iconURL: message.guild.iconURL()!,
				name: args.t(LanguageKeys.Commands.Configuration.Birthday.ListTitle, { guild: message.guild.name })
			})
			.setFooter(
				resolveFooter(args.t(LanguageKeys.Commands.Configuration.Birthday.ListFooter, { count: tasks.length, guild: message.guild.name }))
			);

		const display = new PaginatedMessage({ template });

		for (const page of chunk(tasks, 10)) {
			display.addAsyncPageBuilder(async (builder) => {
				const description = await Promise.all(page.map(async (p) => mapBirthday(p, args.t, message.guild)));
				const embed = new EmbedBuilder().setDescription(resolveDescription(description));
				return builder.setEmbeds([embed]).setContent(null!);
			});
		}

		return display.run(loading, message.author);
	}
}
