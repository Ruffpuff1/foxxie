import {
	Command,
	Identifiers,
	LoaderPieceContext,
	Precondition,
	PreconditionContext,
	PreconditionOptions,
	PreconditionResult
} from '@sapphire/framework';
import { cast } from '@sapphire/utilities';
import { readSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage, PermissionLevels } from '#lib/types';
import { clientOwners } from '#root/config';
import { isGuildOwner } from '#utils/discord';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export abstract class PermissionLevelPrecondition extends Precondition {
	private readonly guildOnly: boolean;

	public constructor(context: LoaderPieceContext<'preconditions'>, options: PermissionLevelPrecondition.Options = {}) {
		super(context, options);
		this.guildOnly = options.guildOnly ?? true;
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction, command: Command, context: PermissionLevelPrecondition.Context) {
		if (!interaction.guild || !interaction.member) {
			return this.guildOnly ? this.error({ identifier: Identifiers.PreconditionGuildOnly }) : this.ok();
		}

		if (clientOwners.includes(interaction.user.id)) return this.ok();
		const member = await interaction.guild.members.fetch(interaction.user.id);

		if (this.shouldRun(member, cast<FoxxieCommand>(command))) {
			const allowed = await this.runPreconditions(member, cast<FoxxieCommand>(command));
			if (allowed) return this.ok();
			if (allowed === false)
				return this.error({
					context: {
						node: `${command.category!.toLowerCase()}.${command.name.toLowerCase()}`
					},
					identifier: LanguageKeys.Preconditions.PermNodes
				});
		}

		return this.handle(interaction, cast<FoxxieCommand>(command), context);
	}

	public override async messageRun(message: GuildMessage, command: Command, context: PermissionLevelPrecondition.Context) {
		if (!message.guild || !message.member) {
			return this.guildOnly ? this.error({ identifier: Identifiers.PreconditionGuildOnly }) : this.ok();
		}

		if (clientOwners.includes(message.author.id)) return this.ok();

		if (this.shouldRun(message.member, cast<FoxxieCommand>(command))) {
			const allowed = await this.runPreconditions(message.member, cast<FoxxieCommand>(command));
			if (allowed) return this.ok();
			if (allowed === false)
				return this.error({
					context: {
						node: `${command.category!.toLowerCase()}.${command.name.toLowerCase()}`
					},
					identifier: LanguageKeys.Preconditions.PermNodes
				});
		}

		return this.handle(message, cast<FoxxieCommand>(command), context);
	}

	protected abstract handle(
		message: ChatInputCommandInteraction | GuildMessage,
		command: FoxxieCommand,
		context: PermissionLevelPrecondition.Context
	): PermissionLevelPrecondition.Result;

	private async runPreconditions(member: GuildMember, command: FoxxieCommand) {
		const { permissionsRoles, permissionsUsers } = await readSettings(member.guild);

		// the matchers for the command node and command node all.
		const commandNode = `${command.category!.toLowerCase()}.${command.name.toLowerCase()}`;
		const commandAll = `${command.category!.toLowerCase()}.*`;

		// a users permission node if present.
		const usersNode = permissionsUsers.find((node) => node.id === member.id);

		/**
		 * If the user's permission node is present try to match the command.
		 * The wildcard is always overwriting of the normal node.
		 * User nodes go first so individual users can bypass a role.
		 */
		if (usersNode) {
			if (usersNode.deny.includes(commandAll) || usersNode.deny.includes(commandNode)) return false;
			if (usersNode.allow.includes(commandAll) || usersNode.allow.includes(commandNode)) return true;
		}

		// Filter through to get the role nodes of only roles the user has.
		const roleNodesOfRolesUserHas = permissionsRoles.filter((node) => member.roles.cache.has(node.id));
		if (!roleNodesOfRolesUserHas.length) return null;

		// sort the role nodes by position of their corresponding role. Highest role should be the first for hirarchy sake.
		const roleNodesSortedByPositionOfRole = roleNodesOfRolesUserHas.sort((a, b) => {
			const aRole = member.guild.roles.cache.get(a.id);
			const bRole = member.guild.roles.cache.get(b.id);

			return bRole!.position - aRole!.position;
		});

		// for each role node check if allowed or denied yielding as such.
		for (const roleNode of roleNodesSortedByPositionOfRole) {
			if (roleNode.deny.includes(commandAll) || roleNode.deny.includes(commandNode)) return false;
			if (roleNode.allow.includes(commandAll) || roleNode.allow.includes(commandNode)) return true;
		}

		// otherwise the command should not be stopped.
		return null;
	}

	private shouldRun(member: GuildMember, command: FoxxieCommand) {
		if (command.guarded) return false;

		if (command.permissionLevel === PermissionLevels.BotOwner) return false;

		if (isGuildOwner(member)) return false;

		return true;
	}
}
export namespace PermissionLevelPrecondition {
	export type Context = PreconditionContext;
	export interface Options extends PreconditionOptions {
		guildOnly?: boolean;
	}
	export type Result = PreconditionResult;
}
