import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { TFunction } from '@sapphire/plugin-i18next';
import { LanguageKeys } from '#lib/i18n';
import { LanguageHelp, LanguageHelpDisplayOptions } from '#lib/I18n/LanguageHelp';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { clientOwners } from '#root/config';
import { resolveClientColor } from '#utils/util';
import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';

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

	async #commandHelp(command: FoxxieCommand, message: GuildMessage, args: FoxxieCommand.Args, prefix: string) {
		const embed = await this.#buildCommandHelp(message, args, command, prefix);
		return send(message, { embeds: [embed] });
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

		console.log(categories);

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
