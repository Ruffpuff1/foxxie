import type { Argument } from '@sapphire/framework';
import type { RoleTypeVariation } from '#lib/moderation';
import type { GuildMessage } from '#lib/types';

import { send } from '@sapphire/plugin-editable-commands';
import { readSettings, writeSettings } from '#lib/database';
import { getT } from '#lib/i18n';
import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand } from '#lib/moderation/structures/ModerationCommand';
import { isAdmin } from '#utils/discord';
import { promptConfirmation, promptForMessage } from '#utils/functions';
import { PermissionFlagsBits, type Role } from 'discord.js';

export abstract class SetUpModerationCommand<Type extends RoleTypeVariation, ValueType> extends ModerationCommand<Type, ValueType> {
	public constructor(context: ModerationCommand.LoaderContext, options: SetUpModerationCommand.Options<Type>) {
		super(context, {
			actionStatusKey: options.isUndoAction
				? LanguageKeys.Moderation.ActionIsNotActiveRestrictionRole
				: LanguageKeys.Moderation.ActionIsActiveRestrictionRole,
			requiredClientPermissions: [PermissionFlagsBits.ManageRoles],
			requiredMember: true,
			...options
		});
	}

	public override async messageRun(
		message: GuildMessage,
		args: ModerationCommand.Args,
		context: ModerationCommand.RunContext
	): Promise<GuildMessage | null> {
		await this.inhibit(message, args, context);
		return super.messageRun(message, args, context);
	}

	protected async askForRole(message: GuildMessage, args: SetUpModerationCommand.Args, context: SetUpModerationCommand.RunContext) {
		const result = await promptForMessage(message, args.t(LanguageKeys.Commands.Moderation.ActionSharedRoleSetupExistingName));
		if (result === null) this.error(LanguageKeys.Commands.Moderation.ActionSharedRoleSetupNoMessage);

		const argument = this.role;
		return argument.run(result, { args, argument, command: this, commandContext: context, message });
	}

	protected async inhibit(message: GuildMessage, args: ModerationCommand.Args, context: ModerationCommand.RunContext) {
		// If the command messageRun is not this one (potentially help command) or the guild is null, return with no error.
		const settings = await readSettings(message.guild);
		const roleId = settings[this.action.roleKey];

		// Verify for role existence.
		const role = (roleId && message.guild.roles.cache.get(roleId)) ?? null;
		if (role) return undefined;

		// If there
		if (!(await isAdmin(message.member))) {
			this.error('commands/moderation:restrictLowLevel');
		}

		const t = getT(settings.language);
		if (await promptConfirmation(message, t(LanguageKeys.Commands.Moderation.ActionSharedRoleSetupExisting))) {
			const role = (await this.askForRole(message, args, context)).unwrapRaw();
			await writeSettings(message.guild, { [this.action.roleKey]: role.id });
		} else if (await promptConfirmation(message, t(LanguageKeys.Commands.Moderation.ActionSharedRoleSetupNew))) {
			await this.action.setup(message);

			const content = t(LanguageKeys.Commands.Moderation.Success);
			await send(message, content);
		} else {
			this.error('commands/configuration/commandHandlerAborted');
		}

		return undefined;
	}

	private get role() {
		return this.container.stores.get('arguments').get('role') as Argument<Role>;
	}
}

export namespace SetUpModerationCommand {
	export type Args = ModerationCommand.Args;

	export type HandlerParameters<ValueType = null> = ModerationCommand.HandlerParameters<ValueType>;
	export type LoaderContext = ModerationCommand.LoaderContext;
	export type Options<Type extends RoleTypeVariation> = ModerationCommand.Options<Type>;

	export type Parameters = ModerationCommand.Parameters;
	export type PostHandleParameters<ValueType = null> = ModerationCommand.PostHandleParameters<ValueType>;
	export type RunContext = ModerationCommand.RunContext;
}
