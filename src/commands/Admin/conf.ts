import { getConfigurableGroups } from '#lib/Database/settings/configuration';
import { readSettings, writeSettingsTransaction } from '#lib/Database/settings/functions';
import { SchemaKey } from '#lib/Database/settings/schema/SchemaKey';
import { isSchemaKey, remove, reset, set } from '#lib/Database/settings/Utils';
import { getSupportedUserLanguageT, LanguageKeys } from '#lib/i18n';
import { SettingsMenu } from '#lib/structures';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import type { GuildMessage } from '#lib/types';
import { PermissionLevels } from '#lib/types';
import { isValidCustomEmoji, isValidSerializedTwemoji, isValidTwemoji } from '#utils/functions/emojis';
import { inlineCode } from '@discordjs/builders';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { filter } from '@sapphire/iterator-utilities/filter';
import { map } from '@sapphire/iterator-utilities/map';
import { toArray } from '@sapphire/iterator-utilities/toArray';
import { send } from '@sapphire/plugin-editable-commands';
import { isNullish, toTitleCase } from '@sapphire/utilities';
import { Awaitable, ChatInputCommandInteraction, InteractionContextType, PermissionFlagsBits } from 'discord.js';

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['settings', 'config', 'configs', 'configuration'],
	description: LanguageKeys.Commands.Admin.ConfDescription,
	detailedDescription: LanguageKeys.Commands.Configuration.BirthdayDetailedDescription,
	guarded: true,
	permissionLevel: PermissionLevels.Administrator,
	runIn: [CommandOptionsRunTypeEnum.GuildAny],
	subcommands: [
		{ name: 'set', messageRun: 'set' },
		{ name: 'add', messageRun: 'set' },
		{ name: 'show', messageRun: 'messageRunShow', chatInputRun: 'chatInputRunShow' },
		{ name: 'remove', messageRun: 'remove' },
		{ name: 'reset', messageRun: 'reset' },
		{ name: 'menu', messageRun: 'menu', default: true }
	]
})
export class UserCommand extends FoxxieSubcommand {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): Awaitable<void> {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('conf')
				.setDescription('config')
				.setContexts(InteractionContextType.Guild)
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('show')
						.setDescription('show a key value')
						.addStringOption((option) => option.setName('key').setDescription('the key').setAutocomplete(true))
						.addBooleanOption((option) => option.setName('show').setDescription('the key'))
				)
		),
			{
				idHints: [
					'1315257499401588736' // nightyl
				]
			};
	}

	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	public menu(message: GuildMessage, args: FoxxieSubcommand.Args, context: FoxxieSubcommand.RunContext) {
		return new SettingsMenu(message, args.t).init(context);
	}

	public async messageRunShow(message: GuildMessage, args: FoxxieSubcommand.Args) {
		const key = args.finished ? '' : await args.pick('string');
		const schemaValue = this.#resolveSchemaValue(key);

		const settings = await readSettings(message.guild);
		const output = schemaValue.display(settings, args.t);

		if (isSchemaKey(schemaValue)) {
			const content = args.t(LanguageKeys.Commands.Admin.ConfGet, { key: schemaValue.name, value: output });
			return send(message, { content, allowedMentions: { users: [], roles: [] } });
		}

		const title = this.#getShowTitle(key);

		return send(message, {
			content: args.t(LanguageKeys.Commands.Admin.Conf, { key: title, list: output }),
			allowedMentions: { users: [], roles: [] }
		});
	}

	public async chatInputRunShow(interaction: FoxxieSubcommand.Interaction) {
		const key = interaction.options.getString('key') ?? '';
		const show = interaction.options.getBoolean('show') ?? false;
		const schemaValue = this.#resolveSchemaValue(key);
		const t = getSupportedUserLanguageT(interaction);

		await interaction.deferReply({ ephemeral: !show });

		const settings = await readSettings(interaction.guild!);
		const output = schemaValue.display(settings, t);

		if (isSchemaKey(schemaValue)) {
			const content = t(LanguageKeys.Commands.Admin.ConfGet, { key: schemaValue.name, value: output });
			return interaction.editReply({ content, allowedMentions: { users: [], roles: [] } });
		}

		const title = this.#getShowTitle(key);

		return interaction.editReply({
			content: t(LanguageKeys.Commands.Admin.Conf, { key: title, list: output }),
			allowedMentions: { users: [], roles: [] }
		});
	}

	public async set(message: GuildMessage, args: FoxxieSubcommand.Args) {
		const [key, schemaKey] = await this.#fetchKey(args);

		using trx = await writeSettingsTransaction(message.guild);
		await trx.write(await set(trx.settings, schemaKey, args)).submit();

		const response = schemaKey.display(trx.settings, args.t);
		return send(message, {
			content: args.t(LanguageKeys.Commands.Admin.ConfUpdated, { key, response: this.#getTextResponse(response) }),
			allowedMentions: { users: [], roles: [] }
		});
	}

	public async remove(message: GuildMessage, args: FoxxieSubcommand.Args) {
		const [key, schemaKey] = await this.#fetchKey(args);

		using trx = await writeSettingsTransaction(message.guild);
		await trx.write(await remove(trx.settings, schemaKey, args)).submit();

		const response = schemaKey.display(trx.settings, args.t);
		return send(message, {
			content: args.t(LanguageKeys.Commands.Admin.ConfUpdated, { key, response: this.#getTextResponse(response) }),
			allowedMentions: { users: [], roles: [] }
		});
	}

	public async reset(message: GuildMessage, args: FoxxieSubcommand.Args) {
		const [key, schemaKey] = await this.#fetchKey(args);

		using trx = await writeSettingsTransaction(message.guild);
		await trx.write(reset(schemaKey)).submit();

		const response = schemaKey.display(trx.settings, args.t);
		return send(message, {
			content: args.t(LanguageKeys.Commands.Admin.ConfReset, { key, value: response }),
			allowedMentions: { users: [], roles: [] }
		});
	}

	#getTextResponse(response: string) {
		return isValidCustomEmoji(response) || isValidSerializedTwemoji(response) || isValidTwemoji(response) ? response : inlineCode(response);
	}

	async #fetchKey(args: FoxxieSubcommand.Args | ChatInputCommandInteraction) {
		const key = args instanceof ChatInputCommandInteraction ? args.options.getString('key', true) : await args.pick('string');

		const value = getConfigurableGroups().getPathString(key.toLowerCase());
		if (isNullish(value) || value.dashboardOnly) {
			this.error(LanguageKeys.Commands.Admin.ConfGetNoExt, { key });
		}

		if (isSchemaKey(value)) {
			return [value.name, value as SchemaKey] as const;
		}

		const keys = map(
			filter(value.childValues(), (value) => !value.dashboardOnly),
			(value) => inlineCode(value.name)
		);
		this.error(LanguageKeys.Settings.Gateway.ChooseKey, { keys: toArray(keys) });
	}

	#resolveSchemaValue(key: string) {
		const schemaValue = getConfigurableGroups().getPathString(key.toLowerCase());
		if (schemaValue === null) this.error(LanguageKeys.Commands.Admin.ConfGetNoExt, { key });
		return schemaValue;
	}

	#getShowTitle(key: string) {
		return key
			? `: ${key
					.split('.')
					.map((key) => toTitleCase(key))
					.join('/')}`
			: '';
	}
}
