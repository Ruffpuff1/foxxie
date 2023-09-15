import { GuildSettings, acquireSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { GuildMessage, PermissionLevels } from '#lib/Types';
import { clientOwners } from '#root/config';
import { isGuildOwner } from '#utils/Discord';
import {
    Identifiers,
    PieceContext,
    Precondition,
    PreconditionContext,
    PreconditionOptions,
    PreconditionResult
} from '@sapphire/framework';
import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import type { FoxxieCommand } from '../commands';

export abstract class PermissionLevelPrecondition extends Precondition {
    private readonly guildOnly: boolean;

    public constructor(context: PieceContext, options: PermissionLevelPrecondition.Options = {}) {
        super(context, options);
        this.guildOnly = options.guildOnly ?? true;
    }

    public async messageRun(message: GuildMessage, command: FoxxieCommand, context: PermissionLevelPrecondition.Context) {
        if (!message.guild || !message.member) {
            return this.guildOnly ? this.error({ identifier: Identifiers.PreconditionGuildOnly }) : this.ok();
        }

        if (clientOwners.includes(message.author.id)) return this.ok();

        if (this.shouldRun(message.member, command)) {
            const allowed = await this.runPreconditions(message.member, command);
            if (allowed === true) return this.ok();
            if (allowed === false)
                return this.error({
                    identifier: LanguageKeys.Preconditions.PermNodes,
                    context: {
                        node: `${command.category!.toLowerCase()}.${command.name.toLowerCase()}`
                    }
                });
        }

        return this.handle(message, command, context);
    }

    public async chatInputRun(
        interaction: ChatInputCommandInteraction,
        command: FoxxieCommand,
        context: PermissionLevelPrecondition.Context
    ) {
        if (!interaction.guild || !interaction.member) {
            return this.guildOnly ? this.error({ identifier: Identifiers.PreconditionGuildOnly }) : this.ok();
        }

        if (clientOwners.includes(interaction.user.id)) return this.ok();
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (this.shouldRun(member, command)) {
            const allowed = await this.runPreconditions(member, command);
            if (allowed === true) return this.ok();
            if (allowed === false)
                return this.error({
                    identifier: LanguageKeys.Preconditions.PermNodes,
                    context: {
                        node: `${command.category!.toLowerCase()}.${command.name.toLowerCase()}`
                    }
                });
        }

        return this.handle(interaction, command, context);
    }

    protected abstract handle(
        message: GuildMessage | ChatInputCommandInteraction,
        command: FoxxieCommand,
        context: PermissionLevelPrecondition.Context
    ): PermissionLevelPrecondition.Result;

    private shouldRun(member: GuildMember, command: FoxxieCommand) {
        if (command.guarded) return false;

        if (command.permissionLevel === PermissionLevels.BotOwner) return false;

        if (isGuildOwner(member)) return false;

        return true;
    }

    private async runPreconditions(member: GuildMember, command: FoxxieCommand) {
        const [enabled, userNodes, roleNodes] = await acquireSettings(member.guild, [
            GuildSettings.PermissionNodes.Enabled,
            GuildSettings.PermissionNodes.Users,
            GuildSettings.PermissionNodes.Roles
        ]);
        if (!enabled) return null;

        // the matchers for the command node and command node all.
        const commandNode = `${command.category!.toLowerCase()}.${command.name.toLowerCase()}`;
        const commandAll = `${command.category!.toLowerCase()}.*`;

        // a users permission node if present.
        const usersNode = userNodes.find(node => node.id === member.id);

        /**
         * If the user's permission node is present try to match the command.
         * The wildcard is always overwriting of the normal node.
         * User nodes go first so individual users can bypass a role.
         */
        if (usersNode) {
            if (usersNode.denied.includes(commandAll) || usersNode.denied.includes(commandNode)) return false;
            if (usersNode.allowed.includes(commandAll) || usersNode.allowed.includes(commandNode)) return true;
        }

        // Filter through to get the role nodes of only roles the user has.
        const roleNodesOfRolesUserHas = roleNodes.filter(node => member.roles.cache.has(node.id));
        if (!roleNodesOfRolesUserHas.length) return null;

        // sort the role nodes by position of their corresponding role. Highest role should be the first for hirarchy sake.
        const roleNodesSortedByPositionOfRole = roleNodesOfRolesUserHas.sort((a, b) => {
            const aRole = member.guild.roles.cache.get(a.id);
            const bRole = member.guild.roles.cache.get(b.id);

            return bRole!.position - aRole!.position;
        });

        // for each role node check if allowed or denied yielding as such.
        for (const roleNode of roleNodesSortedByPositionOfRole) {
            if (roleNode.denied.includes(commandAll) || roleNode.denied.includes(commandNode)) return false;
            if (roleNode.allowed.includes(commandAll) || roleNode.allowed.includes(commandNode)) return true;
        }

        // otherwise the command should not be stopped.
        return null;
    }
}
export namespace PermissionLevelPrecondition {
    export type Context = PreconditionContext;
    export type Result = PreconditionResult;
    export interface Options extends PreconditionOptions {
        guildOnly?: boolean;
    }
}
