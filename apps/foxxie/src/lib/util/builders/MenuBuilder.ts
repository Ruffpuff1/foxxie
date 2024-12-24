import { toTitleCase } from '@ruffpuff/utilities';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { container, version as sapphireVersion } from '@sapphire/framework';
import { cast, isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage, PermissionLevels } from '#lib/types';
import { clientOwners, defaultPaginationOptionsWithoutSelectMenu } from '#root/config';
import { Urls } from '#utils/constants';
import {
	conditionalField,
	conditionalFooter,
	orField,
	removeEmptyFields,
	resolveClientColor,
	resolveDescription,
	resolveField,
	resolveFooter,
	sendLoadingMessage,
	sendMessage
} from '#utils/functions';
import { fetchCommit, getServerDetails } from '#utils/util';
import { bold, EmbedBuilder, hyperlink, inlineCode, italic, Message } from 'discord.js';
import { version as discordVersion } from 'discord.js';

export class MenuBuilder {
	public static async HelpCommand(command: FoxxieCommand, args: FoxxieCommand.Args): Promise<Message | PaginatedMessage> {
		const message = cast<GuildMessage>(args.message);
		const loading = await sendLoadingMessage(message);
		const prefix = args.commandContext.commandPrefix;

		const titles = args.t(LanguageKeys.Commands.General.Help.Titles);
		const commandId = command.getGlobalCommandId();
		const embed = new EmbedBuilder().setColor(await resolveClientColor(args.message, args.message.member?.displayColor)).setTimestamp();

		const extendedHelpData = args.t(command.detailedDescription, { commandId });

		if (isNullishOrEmpty(extendedHelpData.subcommands)) {
			const aliases = [...command.aliases];
			const data = aliases.length
				? args.t(LanguageKeys.Commands.General.Help.DataAlias, {
						aliases,
						footerName: command.name,
						titleDescription: args.t(command.description)
					})
				: args.t(LanguageKeys.Commands.General.Help.Data, { footerName: command.name, titleDescription: args.t(command.description) });

			embed
				.setFooter(resolveFooter(data.footer))
				.setTitle(data.title)
				.addFields(
					removeEmptyFields([
						conditionalField(
							!isNullishOrEmpty(extendedHelpData.usages),
							titles.usages,
							extendedHelpData.usages?.map(
								(usage) =>
									`→ ${prefix}${command.name} ${command.name} ${usage === LanguageKeys.Globals.DefaultT ? '' : usage ? italic(usage) : usage}`
							)
						),
						conditionalField(
							!isNullish(extendedHelpData.extendedHelp),
							titles.extendedHelp,
							Array.isArray(extendedHelpData.extendedHelp) ? extendedHelpData.extendedHelp.join(' ') : extendedHelpData.extendedHelp
						),
						conditionalField(
							!isNullishOrEmpty(extendedHelpData.explainedUsage),
							titles.explainedUsage,
							extendedHelpData.explainedUsage?.map(([arg, desc]) => `→ **${arg}**: ${desc}`)
						),
						resolveField(titles.permissionNode, inlineCode(command.permissionNode))
					])
				);

			return sendMessage(message, embed);
		}

		const { subcommands } = extendedHelpData;
		const display = new PaginatedMessage({
			actions: subcommands.length <= 24 ? undefined : defaultPaginationOptionsWithoutSelectMenu,
			template: { content: null!, embeds: [embed] }
		});

		const pageLabels = [
			`${prefix}${command.name.toLowerCase()}`,
			...subcommands.map((subcommand) => `${prefix}${command.name.toLowerCase()} ${subcommand.name?.toLowerCase()}`)
		];

		const subcommandArgument = await args.pick('string').catch(() => null);
		const foundSubcommand = subcommandArgument
			? subcommands.findIndex(
					(subcommand) =>
						subcommand.name === subcommandArgument.toLowerCase() || subcommand.aliases?.includes(subcommandArgument.toLowerCase())
				)
			: -1;

		display.addPageEmbed((embed) =>
			embed
				.setTitle(args.t(command.description))
				.setFooter(
					conditionalFooter(
						!isNullishOrEmpty(command.aliases),
						args.t(LanguageKeys.Commands.General.Help.Aliases, { aliases: [...command.aliases] })
					)
				)
				.addFields(
					removeEmptyFields([
						conditionalField(
							!isNullish(extendedHelpData.extendedHelp),
							titles.extendedHelp,
							Array.isArray(extendedHelpData.extendedHelp) ? extendedHelpData.extendedHelp.join(' ') : extendedHelpData.extendedHelp
						),
						resolveField(
							titles.subcommands,
							args.t(LanguageKeys.Globals.And, { value: subcommands.map((subcommand) => inlineCode(subcommand.name)) })
						),
						resolveField(titles.permissionNode, inlineCode(command.permissionNode))
					])
				)
		);

		let index = 0;

		for (const subcommand of subcommands) {
			display.addPageEmbed((embed) =>
				embed
					.setTitle(`${args.t(command.description)}: ${toTitleCase(subcommand.name)}`)
					.setFooter(
						conditionalFooter(
							!isNullishOrEmpty(subcommand.aliases),
							args.t(LanguageKeys.Commands.General.Help.Aliases, { aliases: subcommand.aliases })
						)
					)
					.addFields(
						removeEmptyFields([
							orField(
								!isNullishOrEmpty(subcommand.usages),
								resolveField(
									titles.usages,
									subcommand.usages?.map(
										(usage) =>
											`→ ${prefix}${command.name} ${subcommand.name} ${usage === LanguageKeys.Globals.DefaultT ? '' : usage ? italic(usage) : usage}`
									)
								),
								resolveField(titles.usages, `→ ${prefix}${command.name} ${subcommand.name}`)
							),
							conditionalField(
								!isNullish(subcommand.extendedHelp),
								titles.extendedHelp,
								Array.isArray(subcommand.extendedHelp) ? subcommand.extendedHelp.join(' ') : subcommand.extendedHelp
							),
							conditionalField(
								!isNullishOrEmpty(subcommand.explainedUsage),
								titles.explainedUsage,
								subcommand.explainedUsage?.map(([arg, desc]) => `→ **${arg}**: ${desc}`)
							),
							orField(
								!isNullishOrEmpty(subcommand.examples),
								resolveField(titles.examples, [
									index === 0 ? `→ ${prefix}${command.name}` : null,
									...(subcommand.examples?.map(
										(example) =>
											`→ ${prefix}${command.name} ${subcommand.name} ${example === LanguageKeys.Globals.DefaultT ? '' : example ? italic(example) : example}`
									) || [])
								]),
								resolveField(titles.examples, `→ ${prefix}${command.name} ${subcommand.name}`)
							),
							conditionalField(!isNullish(subcommand.reminder), titles.reminders, subcommand.reminder),
							resolveField(titles.permissionNode, inlineCode(`${command.permissionNode}.${subcommand.name}`))
						])
					)
			);

			index++;
		}

		if (subcommands.length <= 24) display.setSelectMenuOptions((pageIndex) => ({ label: pageLabels[pageIndex - 1] }));
		return display.setIndex(foundSubcommand === -1 ? 0 : foundSubcommand + 1).run(loading, message.author);
	}

	public static async HelpMenu(args: FoxxieCommand.Args): Promise<EmbedBuilder> {
		const titles = args.t(LanguageKeys.Commands.General.Help.Titles);

		const embed = new EmbedBuilder()
			.setColor(await resolveClientColor(args.message, args.message.member?.displayColor))
			.setDescription(resolveDescription([hyperlink(titles.support, Urls.Support), hyperlink(titles.terms, Urls.Terms)], ' | '))
			.setFooter(
				resolveFooter(
					args.t(LanguageKeys.Commands.General.Help.Menu, { name: container.client.user?.username }),
					args.message.client.user.displayAvatarURL()
				)
			);

		const categories = args.t(LanguageKeys.Commands.General.Help.Categories);
		const includeAdmin = clientOwners.includes(args.message.author.id);

		const commands = container.stores
			.get('commands')
			.filter((command) => (includeAdmin ? true : cast<FoxxieCommand>(command).permissionLevel !== PermissionLevels.BotOwner));

		const sortedCategories = [...new Set(commands.map((command) => command.category!))]
			.sort((a, b) => a.localeCompare(b))
			.map((category) => categories[category.toLowerCase() as keyof typeof categories])
			.filter((category) => !isNullish(category));

		for (const category of sortedCategories) {
			const categoryCommands = commands
				.sort((a, b) => a.name.localeCompare(b.name))
				.filter((command) => category.includes(toTitleCase(command.category!)))
				.map((command) => inlineCode(command.name));

			embed.addFields(
				resolveField(
					bold(`${category} (${args.t(LanguageKeys.Globals.NumberFormat, { value: categoryCommands.length })})`),
					categoryCommands.join(', ')
				)
			);
		}

		return embed;
	}

	public static async Stats(args: FoxxieCommand.Args): Promise<EmbedBuilder> {
		const member = args.message.member!;
		const { guild } = member;
		const hash = await fetchCommit();
		const head = hash ? ` [${hash}]` : '';

		const shard = (guild ? guild.shardId : 0) + 1;
		const { cpuCount, cpuSpeed, cpuUsage, memoryPercent, memoryUsed, process: pross, totalmemory, totalShards, uptime } = getServerDetails();

		const [guilds, totalMessageCount] = await container.prisma.guilds
			.findMany()
			.then((guilds) => [guilds, guilds.reduce((acc, r) => (acc += r.messageCount), 0)] as const);

		const description = args.t(LanguageKeys.Commands.General.Stats.Menu, {
			cpuCount,
			cpuSpeed,
			cpuUsage,
			deps: MenuBuilder.Dependencies,
			memoryPercent,
			memoryUsed,
			messages: totalMessageCount,
			process: pross,
			servers: guilds.length,
			shard,
			shardTotal: totalShards,
			totalmemory,
			uptime,
			users: container.client.users.cache.filter((user) => container.client.guilds.cache.some((a) => a.members.cache.has(user.id))).size
		});

		return new EmbedBuilder()
			.setAuthor({
				iconURL: container.client.user?.displayAvatarURL(),
				name: `${container.client.user?.username} v${process.env.VERSION_NUM}${container.client.enabledProdOnlyEvent() ? '' : '-dev'}${head}`,
				url: `${Urls.Github}/commit/${hash}`
			})
			.setDescription(description.join('\n'))
			.setColor(await resolveClientColor(guild, member.displayColor))
			.setFooter({ text: `© ${process.env.COPYRIGHT_YEAR} ${container.client.user!.username}` });
	}

	private static Dependencies = [`Node.js ${process.version}`, `Discord.js v${discordVersion}`, `Sapphire v${sapphireVersion}`];
}
