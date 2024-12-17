import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { isNullish, toTitleCase } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { LanguageHelp, LanguageHelpDisplayOptions } from '#lib/I18n/LanguageHelp';
import { FoxxieArgs, FoxxieCommand } from '#lib/structures';
import { FTFunction, GuildMessage } from '#lib/types';
import { clientOwners, defaultPaginationOptionsWithoutSelectMenu } from '#root/config';
import { sendLoadingMessage, sendMessage } from '#utils/functions';
import { resolveClientColor } from '#utils/util';
import { bold, EmbedBuilder, inlineCode, PermissionFlagsBits } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
	aliases: ['h', 'commands'],
	description: LanguageKeys.Commands.General.HelpDescription,
	requiredClientPermissions: [PermissionFlagsBits.EmbedLinks],
	usage: LanguageKeys.Commands.General.HelpUsage
})
export default class UserCommand extends FoxxieCommand {
	public async messageRun(message: GuildMessage, args: FoxxieCommand.Args, ctx: FoxxieCommand.Context) {
		const command = await args.pick('command').catch(() => null);
		if (command) {
			return this.#commandHelp(command, message, args, ctx.commandPrefix);
		}

		return this.#fullHelp(message, args);
	}

	async #buildCommandHelp(message: GuildMessage, args: FoxxieCommand.Args, command: FoxxieCommand, prefixUsed: string) {
		const builderData = args.t(LanguageKeys.System.HelpTitles);

		const builder = new LanguageHelp()
			.setUsages(builderData.usages)
			.setAliases(builderData.aliases)
			.setExtendedHelp(builderData.extendedHelp)
			.setExplainedUsage(builderData.explainedUsage)
			.setExamples(builderData.examples)
			.setPossibleFormats(builderData.possibleFormats)
			.setReminder(builderData.reminders);

		const extendedHelpData = args.t(command.detailedDescription);
		if (extendedHelpData.subcommands?.length) return this.#buildSubcommandHelp(message, args, command, prefixUsed, extendedHelpData);
		const extendedHelp = builder.display(command.name, this.#formatAliases(args.t, command.aliases), extendedHelpData, prefixUsed);

		const data = args.t(LanguageKeys.Commands.General.HelpData, {
			footerName: command.name,
			titleDescription: args.t(command.description)
		});
		return new EmbedBuilder()
			.setColor(await resolveClientColor(message))
			.setTimestamp()
			.setFooter({ text: data.footer })
			.setTitle(data.title)
			.setDescription(extendedHelp);
	}

	async #buildSubcommandHelp(
		message: GuildMessage,
		args: FoxxieArgs,
		command: FoxxieCommand,
		prefixUsed: string,
		extendedHelpData: LanguageHelpDisplayOptions
	): Promise<PaginatedMessage> {
		const template = new EmbedBuilder().setColor(await resolveClientColor(message, message.member.displayColor)).setTimestamp();

		const display = new PaginatedMessage({
			actions: extendedHelpData.subcommands!.length <= 24 ? undefined : defaultPaginationOptionsWithoutSelectMenu,
			template: { content: null!, embeds: [template] }
		});

		const builderData = args.t(LanguageKeys.System.HelpTitles);
		const pageLabels = [
			`${prefixUsed}${command.name.toLowerCase()}`,
			...extendedHelpData.subcommands!.map((s) => `${prefixUsed}${command.name.toLowerCase()} ${s.name.toLowerCase()}`)
		]; // TODO add ability for 25+

		const subcommandArg = await args.pick('string').catch(() => null);
		const foundIndex = subcommandArg
			? extendedHelpData.subcommands?.findIndex(
					(s) => s.name === subcommandArg.toLowerCase() || s.aliases?.includes(subcommandArg.toLowerCase())
				)
			: null;

		console.log(subcommandArg, foundIndex);

		display.addPageEmbed((embed) => {
			embed.setTitle(args.t(command.description));

			if (extendedHelpData.extendedHelp)
				embed.addFields({
					name: builderData.extendedHelp,
					value: Array.isArray(extendedHelpData.extendedHelp) ? extendedHelpData.extendedHelp.join(' ') : extendedHelpData.extendedHelp
				});

			embed
				.addFields([
					{
						name: ':books: | Subcommands',
						value: args.t(LanguageKeys.Globals.And, { value: extendedHelpData.subcommands!.map((s) => inlineCode(s.name)) })
					}
				])
				.setFooter({
					text: `Permission Node: ${command.category?.toLowerCase()}.${command.name}${command.aliases?.length ? `\nSubcommand Aliases: ${args.t(LanguageKeys.Globals.And, { value: command.aliases })}` : ''}`
				});

			return embed;
		});

		for (const subcommand of extendedHelpData.subcommands!) {
			display.addPageEmbed((embed) => {
				embed.setTitle(`${args.t(command.description)}: ${toTitleCase(subcommand.name)}`);

				if (subcommand.usages?.length) {
					embed.addFields({
						name: builderData.usages,
						value: subcommand.usages
							.map(
								(usage) =>
									`→ ${prefixUsed}${command.name} ${subcommand.name}${usage === LanguageKeys.Globals.DefaultT ? '' : ` *${usage}*`}`
							)
							.join('\n')
					});
				}

				if (subcommand.extendedHelp)
					embed.addFields({
						name: builderData.extendedHelp,
						value: Array.isArray(subcommand.extendedHelp) ? subcommand.extendedHelp.join(' ') : subcommand.extendedHelp
					});

				if (subcommand.explainedUsage) {
					embed.addFields({
						name: builderData.explainedUsage,
						value: subcommand.explainedUsage.map(([arg, desc]) => `→ **${arg}**: ${desc}`).join('\n')
					});
				}

				if (subcommand.examples?.length) {
					embed.addFields({
						name: builderData.examples,
						value: subcommand.examples
							.map(
								(example) =>
									`→ ${prefixUsed}${command.name} ${subcommand.name}${example === LanguageKeys.Globals.DefaultT ? '' : ` *${example}*`}`
							)
							.join('\n')
					});
				} else {
					embed.addFields({
						name: builderData.examples,
						value: `→ ${prefixUsed}${command.name} ${subcommand.name}`
					});
				}

				if (subcommand.reminder)
					embed.addFields({
						name: builderData.reminders,
						value: subcommand.reminder
					});

				embed.setFooter({
					text: `Permission Node: ${command.category?.toLowerCase()}.${command.name}.${subcommand.name}${subcommand.aliases?.length ? `\nAliases: ${args.t(LanguageKeys.Globals.And, { value: subcommand.aliases })}` : ''}`
				});

				return embed;
			});
		}

		console.log(pageLabels);

		if (extendedHelpData.subcommands!.length <= 24) display.setSelectMenuOptions((pageIndex) => ({ label: pageLabels[pageIndex - 1] }));
		return display.setIndex(isNullish(foundIndex) ? 0 : foundIndex + 1);
	}

	async #commandHelp(command: FoxxieCommand, message: GuildMessage, args: FoxxieCommand.Args, prefix: string) {
		const loading = await sendLoadingMessage(message);
		const embed = await this.#buildCommandHelp(message, args, command, prefix);
		return embed instanceof PaginatedMessage ? embed.run(loading, message.author) : sendMessage(message, embed);
	}

	#formatAliases(t: FTFunction, aliases: readonly string[]): null | string {
		if (aliases.length === 0) return null;
		return t(LanguageKeys.Globals.And, { value: aliases.map((alias) => `\`${alias}\``) });
	}

	async #fullHelp(message: GuildMessage, args: FoxxieCommand.Args) {
		const embed = new EmbedBuilder() //
			.setAuthor({
				iconURL: message.client.user.displayAvatarURL(),
				name: args.t(LanguageKeys.Commands.General.HelpMenu, { name: this.container.client.user?.username })
			})
			.setThumbnail(message.client.user.displayAvatarURL())
			.setColor(await resolveClientColor(message));

		const tCategories = args.t(LanguageKeys.Commands.General.HelpCategories);
		const includeAdmin = clientOwners.includes(message.author.id);

		const commands = this.container.stores.get('commands').filter((a) => (includeAdmin ? true : a.category !== 'Admin'));
		const categories = [...new Set(commands.map((c) => c.category!))]
			.sort((a, b) => a.localeCompare(b))
			.map((c) => tCategories[c.toLowerCase() as keyof typeof tCategories]);

		embed.setDescription(
			`Here's all of my commands, right now I have ${commands.size}. Need more info on a certain command? Just do ${inlineCode(`${args.commandContext.commandPrefix}help (command)`)}.`
		);

		for (const category of categories) {
			const categoryCommands = commands //
				.sort((a, b) => a.name.localeCompare(b.name))
				.filter((c) => category.includes(c.category!))
				.map((c) => `\`${c.name}\``);

			embed.addFields([
				{
					name: bold(`${category} (${categoryCommands.length})`),
					value: categoryCommands.join(', ')
				}
			]);
		}

		return sendMessage(message, embed);
	}
}
