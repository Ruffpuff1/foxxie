import { container, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { PermissionsNode, ReadonlyGuildData } from '#lib/database';
import { matchAny } from '#lib/database/utils/matchers/Command';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand, FoxxieSubcommand } from '#lib/structures';
import { emojis } from '#utils/constants';
import { resolveGuild } from '#utils/functions';
import { Collection, GuildMember, Role, type User } from 'discord.js';

export const enum PermissionNodeAction {
	Allow,
	Deny
}

interface PermissionsManagerNode {
	allow: Set<string>;
	deny: Set<string>;
}

export class PermissionNodeManager {
	#cachedRawPermissionRoles: readonly PermissionsNode[] = [];
	#cachedRawPermissionUsers: readonly PermissionsNode[] = [];
	private sorted = new Collection<string, PermissionsManagerNode>();

	public constructor(settings: ReadonlyGuildData) {
		this.refresh(settings);
	}

	public add(target: GuildMember | Role | User, command: string, action: PermissionNodeAction): readonly PermissionsNode[] {
		const nodes = this.#getPermissionNodes(target);

		const nodeIndex = nodes.findIndex((n) => n.id === target.id);
		if (nodeIndex === -1) {
			const node: PermissionsNode = {
				allow: action === PermissionNodeAction.Allow ? [command] : [],
				deny: action === PermissionNodeAction.Deny ? [command] : [],
				id: target.id
			};

			return nodes.concat(node);
		}

		const previous = nodes[nodeIndex];
		if (
			(action === PermissionNodeAction.Allow && previous.allow.includes(command)) ||
			(action === PermissionNodeAction.Deny && previous.deny.includes(command))
		) {
			throw new UserError({ context: { command }, identifier: LanguageKeys.Serializers.PermissionNodeDuplicatedCommand });
		}

		const node: PermissionsNode = {
			allow: action === PermissionNodeAction.Allow ? previous.allow.concat(command) : previous.allow,
			deny: action === PermissionNodeAction.Deny ? previous.deny.concat(command) : previous.deny,
			id: target.id
		};

		return nodes.with(nodeIndex, node);
	}

	public buildTree(node: PermissionsManagerNode, target: GuildMember | Role) {
		const object = {};
		const sorted = container.stores.get('commands').sort((a, b) => a.category!.localeCompare(b.category!));
		const categories = [...new Set(sorted.map((c) => c.category))].map((c) => c!.toLowerCase());

		const allowed = [...node.allow];
		const denied = [...node.deny];

		for (const category of categories) {
			const categoryValue = this.resolveCategory(allowed, denied, category);
			Reflect.set(object, category, categoryValue);
			if (typeof categoryValue === 'boolean' || categoryValue === null) continue;

			const commands = container.stores.get('commands').filter((c) => c.category!.toLowerCase() === category);
			const sortedCommands = commands.sort((a, b) => a.name.localeCompare(b.name));

			for (const command of sortedCommands.values()) {
				const commandValue = this.resolveCommand(allowed, denied, category, command as FoxxieSubcommand);
				Reflect.set(Reflect.get(object, category), command.name.toLowerCase(), commandValue);
			}
		}

		const out = [];
		const name = target instanceof Role ? (target.id === target.guild.id ? 'Everyone' : target.name) : target.displayName;

		out.push(`Permissions for **${name}**`, '');

		if (node.allow.has('*')) {
			out.push(`${emojis.perms.granted} all commands (*)`);
			return out.join('\n');
		} else if (node.deny.has('*')) {
			out.push(`${emojis.perms.denied} all commands (*)`);
			return out.join('\n');
		}

		for (const category of Object.keys(object)) {
			const value = Reflect.get(object, category);
			if (value === null && category === 'admin') continue;
			out.push(this.buildField(value, category));
			if (typeof value === 'object') {
				let i = 0;
				if (isNullish(value)) continue;
				const commandKeys = Object.keys(value);
				const filteredKeys = commandKeys.filter((k) => value[k] !== null);
				const size = filteredKeys.length;
				for (const cmd of filteredKeys) {
					i++;
					const cValue = value[cmd];
					out.push(`${i === size ? ' ' : '  '}${i === size ? '└──' : '├──'}${this.buildField(cValue, cmd)}`);
					if (typeof cValue === 'object') {
						let s = 0;
						if (isNullish(cValue)) continue;
						const subcommandKeys = Object.keys(cValue);
						const filteredSubcommandKeys = subcommandKeys.filter((k) => cValue[k] !== null);
						const sSize = filteredSubcommandKeys.length;
						for (const sCmd of filteredSubcommandKeys) {
							s++;
							const scValue = cValue[sCmd];
							out.push(`${s === sSize ? '   |        └──' : '   |        ├──'}${this.buildField(scValue, sCmd)}`);
						}
					}
				}
			}
		}

		return out.join('\n');
	}

	public display(target: GuildMember | Role) {
		const node = target instanceof Role ? this.findRoleNode(target.id) : this.findUserNode(target.id);
		console.log(node);
		return this.buildTree(node, target);
	}

	public has(roleId: string) {
		return this.sorted.has(roleId);
	}

	public refresh(settings: ReadonlyGuildData): readonly PermissionsNode[] {
		const nodes = settings.permissionsRoles;
		this.#cachedRawPermissionRoles = nodes;
		this.#cachedRawPermissionUsers = settings.permissionsUsers;

		if (nodes.length === 0) {
			this.sorted.clear();
			return nodes;
		}

		// Generate sorted data and detect useless nodes to remove
		const { pendingToAdd, pendingToRemove } = this.generateSorted(settings, nodes);

		// Set up everything
		const sorted = new Collection<string, PermissionsManagerNode>();
		for (const pending of pendingToAdd) {
			sorted.set(pending.id, {
				allow: new Set(pending.allow),
				deny: new Set(pending.deny)
			});
		}

		this.sorted = sorted;

		let copy: null | PermissionsNode[] = null;

		// Delete redundant entries
		for (const removedItem of pendingToRemove) {
			const removedIndex = nodes.findIndex((element) => element.id === removedItem);
			if (removedIndex !== -1) {
				copy ??= nodes.slice();
				copy.splice(removedIndex, 1);
			}
		}

		return copy ?? nodes;
	}

	public remove(target: GuildMember | Role | User, command: string, action: PermissionNodeAction): readonly PermissionsNode[] {
		const nodes = this.#getPermissionNodes(target);

		const nodeIndex = nodes.findIndex((n) => n.id === target.id);
		if (nodeIndex === -1) {
			throw new UserError({ identifier: 'commands/configuration/permission:nodeNotExists' });
		}

		const property = this.getName(action);
		const previous = nodes[nodeIndex];
		const commandIndex = previous[property].indexOf(command);
		if (commandIndex === -1) {
			throw new UserError({ identifier: 'commands/configuration/permission:commandNotExists' });
		}

		const node: PermissionsNode = {
			allow: previous.allow.toSpliced(commandIndex, 1),
			deny: previous.deny.toSpliced(commandIndex, 1),
			id: target.id
		};

		return node.allow.length === 0 && node.deny.length === 0 //
			? nodes.toSpliced(nodeIndex, 1)
			: nodes.with(nodeIndex, node);
	}

	public reset(target: GuildMember | Role | User): readonly PermissionsNode[] {
		const nodes = this.#getPermissionNodes(target);

		const nodeIndex = nodes.findIndex((n) => n.id === target.id);
		if (nodeIndex === -1) {
			throw new UserError({ context: { target }, identifier: 'commands/configuration/permission:nodeNotExists' });
		}

		return nodes.toSpliced(nodeIndex, 1);
	}

	public resolveCategory(allowed: string[], denied: string[], category: string) {
		if (allowed.includes(`${category}.*`)) return true;
		if (denied.includes(`${category}.*`)) return false;

		if (allowed.some((a) => a.startsWith(category)) || denied.some((a) => a.startsWith(category))) return {};
		return null;
	}

	public resolveCommand(allowed: string[], denied: string[], category: string, command: FoxxieSubcommand) {
		const name = command.name.toLowerCase();
		const base = `${category}.${name}`;

		const subcommands = command.parsedSubcommandMappings?.map((c) => c.name.toLowerCase()) || [];
		const hasSubcommands = Boolean(subcommands);

		if (allowed.includes(`${base}.*`) || allowed.includes(base)) return true;
		if (denied.includes(`${base}.*`) || denied.includes(base)) return false;

		if (hasSubcommands) {
			const options = subcommands.map((s) => `${base}.${s}`);
			if (allowed.some((a) => options.includes(a) || denied.some((a) => options.includes(a)))) {
				const opts = {};
				for (const subcommand of subcommands) {
					const key = `${base}.${subcommand}`;

					if (allowed.includes(key)) Reflect.set(opts, subcommand, true);
					else if (denied.includes(key)) Reflect.set(opts, subcommand, true);
					else Reflect.set(opts, subcommand, null);
				}

				return opts;
			}

			return null;
		}
		return null;
	}

	public run(member: GuildMember, command: FoxxieCommand) {
		return this.runUser(member, command) ?? this.runRole(member, command);
	}

	public settingsPropertyFor(target: GuildMember | Role | User) {
		return (target instanceof Role ? 'permissionsRoles' : 'permissionsUsers') satisfies keyof ReadonlyGuildData;
	}

	#getPermissionNodes(target: GuildMember | Role | User): readonly PermissionsNode[] {
		return target instanceof Role ? this.#cachedRawPermissionRoles : this.#cachedRawPermissionUsers;
	}

	private buildField(entry: boolean | null, key: string) {
		if (typeof entry === 'boolean') return `${entry ? emojis.perms.granted : emojis.perms.denied} **${key}**`;
		return `${emojis.perms.notSpecified} ${key}`;
	}

	private findRoleNode(id: string) {
		const defaultNode: PermissionsManagerNode = {
			allow: new Set(),
			deny: new Set()
		};

		return this.sorted.get(id) || defaultNode;
	}

	private findUserNode(id: string) {
		const defaultNode: PermissionsManagerNode = {
			allow: new Set(),
			deny: new Set()
		};

		const found = this.#cachedRawPermissionUsers.find((w) => w.id === id);
		if (!found) return defaultNode;

		return {
			allow: new Set(found.allow),
			deny: new Set(found.deny)
		};
	}

	private generateSorted(settings: ReadonlyGuildData, nodes: readonly PermissionsNode[]) {
		const { pendingToRemove, sortedRoles } = this.getSortedRoles(settings, nodes);

		const sortedNodes: PermissionsNode[] = [];
		for (const sortedRole of sortedRoles.values()) {
			const node = nodes.find((node) => node.id === sortedRole.id);
			if (node === undefined) continue;

			sortedNodes.push(node);
		}

		return {
			pendingToAdd: sortedNodes,
			pendingToRemove
		};
	}

	private getName(type: PermissionNodeAction) {
		switch (type) {
			case PermissionNodeAction.Allow:
				return 'allow';
			case PermissionNodeAction.Deny:
				return 'deny';
			default:
				throw new Error('Unreachable');
		}
	}

	private getSortedRoles(settings: ReadonlyGuildData, rawNodes: readonly PermissionsNode[]) {
		const ids = new Set(rawNodes.map((rawNode) => rawNode.id));
		const guild = resolveGuild(settings.id);

		// I know we should never rely on private methods, however, `Guild#_sortedRoles`
		// exists in v13 and is called every time the `Role#position` getter is called,
		// so to avoid doing a very expensive call for each role, we will call this once
		// and then handle whatever it returns. This has a cost of O(n * log(n)), which is
		// pretty good. For 255 role permission nodes, this would do 1,413 checks.
		//
		// An alternative is to filter, then map the roles by their position, but that has
		// a cost of O(n) * O(n * log(n)), which is really bad, with a total amount of
		// 360,320 checks.
		//
		// Although that's also theoretical, `Guild#_sortedRoles` calls `Util.discordSort`
		// with the role cache, which besides checking for positions, also does up to 4
		// string operations (`String#slice()` and `Number(string)` in each), which is
		// already a performance killer.
		//
		// eslint-disable-next-line @typescript-eslint/dot-notation
		const roles = guild['_sortedRoles']()
			// Set#delete returns `true` when the entry exists, so we will use this
			// to automatically sweep the valid entries and leave the invalid ones out
			.filter((role) => ids.delete(role.id));

		// Guild#_sortedRoles sorts in the inverse order, so we need to turn it into an array and reverse it:
		const reversed = [...roles.values()].reverse();

		return {
			pendingToRemove: ids,
			sortedRoles: reversed
		};
	}

	// private makeNodeObject(node: PermissionsNode): ReturnNode | true {
	// 	const tree = Object.fromEntries(this.categories.map((i) => [i, cast<boolean | Record<string, boolean>>({})]));

	// 	for (const perm of node.allowed) {
	// 		const [category, command] = perm.split('.');

	// 		if (!command && category === '*') {
	// 			return true;
	// 		}

	// 		if (!this.categories.includes(category)) continue;

	// 		if (command === '*') {
	// 			tree[category] = true;
	// 			continue;
	// 		}

	// 		if (typeof tree[category] === 'boolean') continue;
	// 		(tree[category] as Record<string, boolean>)[command] = true;
	// 	}

	// 	return tree;
	// }

	private runRole(member: GuildMember, command: FoxxieCommand) {
		const roles = member.roles.cache;

		// Assume sorted data
		for (const [id, node] of this.sorted.entries()) {
			if (!roles.has(id)) continue;
			if (matchAny(node.allow, command)) return true;
			if (matchAny(node.deny, command)) return false;
		}

		return null;
	}

	private runUser(member: GuildMember, command: FoxxieCommand) {
		// Assume sorted data
		const permissionNodeRoles = this.#cachedRawPermissionUsers;
		const memberId = member.id;
		for (const node of permissionNodeRoles) {
			if (node.id !== memberId) continue;
			if (matchAny(node.allow, command)) return true;
			if (matchAny(node.deny, command)) return false;
		}

		return null;
	}
}
