import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { cast, isNullish, toTitleCase } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { LanguageHelpDisplayOptions } from '#lib/i18n/LanguageHelp';
import { FoxxieArgs, FoxxieCommand } from '#lib/structures';
import { GuildMessage, PermissionLevels } from '#lib/types';
import { clientOwners, defaultPaginationOptionsWithoutSelectMenu } from '#root/config';
import { Urls } from '#utils/constants';
import { sendLoadingMessage, sendMessage } from '#utils/functions';
import { conditionalField, resolveClientColor } from '#utils/util';
import { bold, EmbedBuilder, hyperlink, inlineCode, italic, PermissionFlagsBits } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
	aliases: ['h', 'commands'],
	description: LanguageKeys.Commands.General.Help.Description,
	requiredClientPermissions: [PermissionFlagsBits.EmbedLinks],
	requiredUserPermissions: [PermissionFlagsBits.EmbedLinks]
})
export default class UserCommand extends FoxxieCommand {
	public async messageRun(message: GuildMessage, args: FoxxieCommand.Args, ctx: FoxxieCommand.Context) {
		const command = await args.pick('command').catch(() => null);
		if (command) return this.#commandHelp(command, message, args, ctx.commandPrefix);
		return this.#fullHelp(message, args);
	}

	async #buildCommandHelp(message: GuildMessage, args: FoxxieCommand.Args, command: FoxxieCommand, prefixUsed: string) {
		const builderData = args.t(LanguageKeys.Commands.General.Help.Titles);

		const commandId = command.getGlobalCommandId();
		const extendedHelpData = args.t(command.detailedDescription, { commandId }) as LanguageHelpDisplayOptions;
		if (extendedHelpData.subcommands?.length) return this.#buildSubcommandHelp(message, args, command, prefixUsed, extendedHelpData);
		const aliases = [...command.aliases];

		const data = args.t(LanguageKeys.Commands.General.Help.Data, {
			aliases: aliases.length ? aliases : undefined,
			context: aliases.length ? 'alias' : undefined,
			footerName: command.name,
			titleDescription: args.t(command.description)
		});

		const embed = new EmbedBuilder()
			.setColor(await resolveClientColor(message))
			.setTimestamp()
			.setFooter({ text: data.footer })
			.setTitle(data.title);

		embed.addFields(
			[
				conditionalField(
					Boolean(extendedHelpData.usages?.length),
					builderData.usages,
					extendedHelpData.usages
						?.map(
							(usage) =>
								`→ ${prefixUsed}${command.name} ${command.name} ${usage === LanguageKeys.Globals.DefaultT ? '' : usage ? italic(usage) : usage}`
						)
						.join('\n')
				),
				conditionalField(
					Boolean(extendedHelpData.extendedHelp),
					builderData.extendedHelp,
					Array.isArray(extendedHelpData.extendedHelp) ? extendedHelpData.extendedHelp?.join(' ') : extendedHelpData.extendedHelp
				),
				conditionalField(
					Boolean(extendedHelpData.explainedUsage?.length),
					builderData.explainedUsage,
					extendedHelpData.explainedUsage?.map(([arg, desc]) => `→ **${arg}**: ${desc}`).join('\n')
				)
			].filter((field) => !isNullish(field))
		);

		return embed.addFields({ name: builderData.permissionNode, value: inlineCode(command.permissionNode) });
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

		const builderData = args.t(LanguageKeys.Commands.General.Help.Titles);
		const pageLabels = [
			`${prefixUsed}${command.name.toLowerCase()}`,
			...extendedHelpData.subcommands!.map((s) => `${prefixUsed}${command.name.toLowerCase()} ${s.name?.toLowerCase()}`)
		]; // TODO add ability for 25+

		const subcommandArg = await args.pick('string').catch(() => null);
		const foundIndex = subcommandArg
			? extendedHelpData.subcommands?.findIndex(
					(s) => s.name === subcommandArg.toLowerCase() || s.aliases?.includes(subcommandArg.toLowerCase())
				)
			: null;

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
						name: builderData.subcommands,
						value: args.t(LanguageKeys.Globals.And, { value: extendedHelpData.subcommands!.map((s) => inlineCode(s.name)) })
					}
				])
				.addFields({ name: builderData.permissionNode, value: inlineCode(command.permissionNode) });

			if (command.aliases.length) {
				embed.setFooter({
					text: args.t(LanguageKeys.Commands.General.Help.Aliases, { aliases: [...command.aliases] })
				});
			}

			return embed;
		});

		let idx = 0;

		if (extendedHelpData.subcommands?.length) {
			for (const subcommand of extendedHelpData.subcommands) {
				display.addPageEmbed((embed) => {
					embed.setTitle(`${args.t(command.description)}: ${toTitleCase(subcommand.name)}`);

					if (subcommand.usages?.length) {
						embed.addFields({
							name: builderData.usages,
							value: subcommand.usages
								.map(
									(usage) =>
										`→ ${prefixUsed}${command.name} ${subcommand.name} ${usage === LanguageKeys.Globals.DefaultT ? '' : usage ? italic(usage) : usage}`
								)
								.join('\n')
						});
					} else {
						embed.addFields({
							name: builderData.usages,
							value: `→ ${prefixUsed}${command.name} ${subcommand.name}`
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
							value: [
								idx === 0 ? `→ ${prefixUsed}${command.name}` : null,
								...subcommand.examples.map(
									(example) =>
										`→ ${prefixUsed}${command.name} ${subcommand.name} ${example === LanguageKeys.Globals.DefaultT ? '' : example ? italic(example) : example}`
								)
							]
								.filter((a) => !isNullish(a))
								.join('\n')
						});
					} else {
						embed.addFields({
							name: builderData.examples,
							value: `→ ${prefixUsed}${command.name} ${subcommand.name}`
						});
					}

					if (subcommand.reminder) {
						embed.addFields({
							name: builderData.reminders,
							value: subcommand.reminder
						});
					}

					embed.addFields({
						name: builderData.permissionNode,
						value: inlineCode(`${command.permissionNode}.${subcommand.name}`)
					});

					if (subcommand.aliases?.length) {
						embed.setFooter({
							text: args.t(LanguageKeys.Commands.General.Help.Aliases, { aliases: subcommand.aliases })
						});
					}

					return embed;
				});

				idx++;
			}
		}

		if (extendedHelpData.subcommands!.length <= 24) display.setSelectMenuOptions((pageIndex) => ({ label: pageLabels[pageIndex - 1] }));
		return display.setIndex(isNullish(foundIndex) ? 0 : foundIndex + 1);
	}

	async #commandHelp(command: FoxxieCommand, message: GuildMessage, args: FoxxieCommand.Args, prefix: string) {
		const loading = await sendLoadingMessage(message);
		const embed = await this.#buildCommandHelp(message, args, command, prefix);
		return embed instanceof PaginatedMessage ? embed.run(loading, message.author) : sendMessage(message, embed);
	}

	async #fullHelp(message: GuildMessage, args: FoxxieCommand.Args) {
		const titles = args.t(LanguageKeys.Commands.General.Help.Titles);

		const embed = new EmbedBuilder() //
			.setFooter({
				iconURL: message.client.user.displayAvatarURL(),
				text: args.t(LanguageKeys.Commands.General.Help.Menu, { name: this.container.client.user?.username })
			})
			.setDescription([hyperlink(titles.support, Urls.Support), hyperlink(titles.terms, 'https://foxxie.rshk.me/terms')].join(' | '))
			.setColor(await resolveClientColor(message));

		const tCategories = args.t(LanguageKeys.Commands.General.Help.Categories);
		const includeAdmin = clientOwners.includes(message.author.id);

		const commands = this.container.stores
			.get('commands')
			.filter((a) => (includeAdmin ? true : cast<FoxxieCommand>(a).permissionLevel !== PermissionLevels.BotOwner));

		const categories = [...new Set(commands.map((c) => c.category!))]
			.sort((a, b) => a.localeCompare(b))
			.map((c) => tCategories[c.toLowerCase() as keyof typeof tCategories])
			.filter((a) => !isNullish(a));

		for (const category of categories) {
			const categoryCommands = commands //
				.sort((a, b) => a.name.localeCompare(b.name))
				.filter((c) => category.includes(toTitleCase(c.category!)))
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
