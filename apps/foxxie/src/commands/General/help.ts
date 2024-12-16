import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { send } from '@sapphire/plugin-editable-commands';
import { TFunction } from '@sapphire/plugin-i18next';
import { isNullish, toTitleCase } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { LanguageHelp, LanguageHelpDisplayOptions } from '#lib/I18n/LanguageHelp';
import { FoxxieArgs, FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { clientOwners } from '#root/config';
import { sendLoadingMessage } from '#utils/functions';
import { resolveClientColor } from '#utils/util';
import { EmbedBuilder, inlineCode, PermissionFlagsBits } from 'discord.js';

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

		const extendedHelpData = args.t(command.detailedDescription, { prefix: prefixUsed }) as LanguageHelpDisplayOptions;
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
		console.log(prefixUsed);
		const display = new PaginatedMessage({ template: { content: null!, embeds: [template] } });
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
						value: args.t(LanguageKeys.Globals.And, { value: extendedHelpData.subcommands?.map((s) => inlineCode(s.name)) })
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
							.map((usage) => `→ ${prefixUsed}${command.name} ${subcommand.name}${usage.length === 0 ? '' : ` *${usage}*`}`)
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
							.map((example) => `→ ${prefixUsed}${command.name} ${subcommand.name}${example ? ` *${example}*` : ''}`)
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

		return display
			.setIndex(isNullish(foundIndex) ? 0 : foundIndex + 1)
			.setSelectMenuOptions((pageIndex) => ({ label: pageLabels[pageIndex - 1] }));
	}

	async #commandHelp(command: FoxxieCommand, message: GuildMessage, args: FoxxieCommand.Args, prefix: string) {
		const loading = await sendLoadingMessage(message);
		const embed = await this.#buildCommandHelp(message, args, command, prefix);
		return embed instanceof PaginatedMessage ? embed.run(loading, message.author) : send(message, { embeds: [embed] });
	}

	#formatAliases(t: TFunction, aliases: readonly string[]): null | string {
		if (aliases.length === 0) return null;
		return t(LanguageKeys.Globals.And, { value: aliases.map((alias) => `\`${alias}\``) });
	}

	async #fullHelp(message: GuildMessage, args: FoxxieCommand.Args) {
		const embed = new EmbedBuilder() //
			.setAuthor({
				name: args.t(LanguageKeys.Commands.General.HelpMenu, { name: this.container.client.user?.username })
			})
			.setColor(await resolveClientColor(message));

		const tCategories = args.t(LanguageKeys.Commands.General.HelpCategories);

		const commands = this.container.stores.get('commands');
		const categories = [...new Set(this.container.stores.get('commands').map((c) => c.category!))]
			.filter((c) => (clientOwners.includes(message.author.id) ? true : c !== 'Admin'))
			.map((c) => tCategories[c.toLowerCase() as keyof typeof tCategories])
			.sort((a, b) => a.localeCompare(b));

		for (const category of categories)
			embed.addFields([
				{
					name: category,
					value: commands //
						.sort((a, b) => a.name.localeCompare(b.name))
						.filter((c) => c.category === category)
						.map((c) => `\`${c.name}\``)
						.join(', ')
				}
			]);

		return send(message, { embeds: [embed] });
	}
}
