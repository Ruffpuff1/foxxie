import { GuildSettings, PermissionNode } from '#lib/Database';
import { FoxxieCommand } from '#lib/Structures';
import { emojis } from '#utils/constants';
import { cast } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { Guild, GuildMember, Role } from 'discord.js';

export class GuildPermissionService {
    public guild: Guild;

    public constructor(guild: Guild) {
        this.guild = guild;
    }

    public async showNodes(target: GuildMember | Role) {
        const guildNodes = await this.fetchNodeSettings();

        if (target instanceof GuildMember) {
            return this.display(target, 'users', guildNodes);
        }

        if (target.id === this.guild.id) {
            return this.display(target, 'everyone', guildNodes);
        }

        return this.display(target, 'roles', guildNodes);
    }

    public display(target: GuildMember | Role, treeName: 'users' | 'roles' | 'everyone', nodes: Nodes) {
        let node: ReturnNode | true;

        switch (treeName) {
            case 'users': {
                node = this.makeNodeObject(this.findNode(nodes, 'user', target.id));
                return this.buildTree(node, target);
            }
            case 'everyone':
            case 'roles': {
                node = this.makeNodeObject(this.findNode(nodes, 'role', target.id));
                return this.buildTree(node, target);
            }
            default:
                node = {};
        }

        return node;
    }

    public buildTree(node: ReturnNode | true, target: 'everyone' | GuildMember | Role) {
        const out = [];
        const name = target === 'everyone' ? 'everyone' : target instanceof GuildMember ? target.displayName : target.name;

        out.push(`Permissions for **${name}**`, '');

        console.log(node);

        if (node === true) {
            out.push(`${emojis.perms.granted} all commands (*)`);
        } else {
            // eslint-disable-next-line guard-for-in
            for (const category in node) {
                out.push(this.buildField(node[category] as boolean, category));

                if (typeof node[category] === 'object') {
                    let i = 0;
                    const commands = Object.keys(node[category]);
                    const keys = Object.keys(node[category]).length;

                    for (const command of commands) {
                        i++;
                        out.push(
                            `${i === keys ? ' ' : '  '}${i === keys ? '└──' : '├──'}${this.buildField(
                                (node[category] as Record<string, boolean>)[command],
                                command
                            )}`
                        );
                    }
                }
            }
        }

        return out.join('\n');
    }

    private buildField(entry: boolean, key: string) {
        if (typeof entry === 'boolean') return `${entry ? emojis.perms.granted : emojis.perms.denied} **${key}**`;
        return `${emojis.perms.notSpecified} ${key}`;
    }

    private async fetchNodeSettings(): Promise<Nodes> {
        const [roles, member] = await this.settings.get([
            GuildSettings.PermissionNodes.Roles,
            GuildSettings.PermissionNodes.Users
        ]);

        return {
            everyone: roles.find(r => r.id === this.guild.id) || { allowed: [], denied: [] },
            roles: roles.filter(r => r.id !== this.guild.id),
            member
        };
    }

    private makeNodeObject(node: PermissionNode): true | ReturnNode {
        const tree = Object.fromEntries(this.categories.map(i => [i, cast<Record<string, boolean> | boolean>({})]));

        for (const perm of node.allowed) {
            const [category, command] = perm.split('.');
            console.log(category, command);

            if (!command && category === '*') {
                return true;
            }

            if (!this.categories.includes(category)) continue;

            if (command === '*') {
                tree[category] = true;
                continue;
            }

            if (typeof tree[category] === 'boolean') continue;
            (tree[category] as Record<string, boolean>)[command] = true;
        }

        console.log(node.allowed);

        return tree;
    }

    private findNode(nodes: Nodes, type: 'user' | 'role', id: string) {
        const defaultNode = {
            allowed: [],
            denied: [],
            id
        };

        console.log(nodes);

        switch (type) {
            case 'user': {
                const foundNode = nodes.member.find(node => node.id === id);
                return foundNode || defaultNode;
            }
            case 'role': {
                const foundNode = nodes.roles.find(node => node.id === id);
                return foundNode || defaultNode;
            }
        }
    }

    public get categories() {
        return container.stores
            .get('commands')
            .map(c => cast<FoxxieCommand>(c).category!.toLowerCase())
            .filter(category => category !== 'admin');
    }

    public get settings() {
        return container.utilities.guild(this.guild.id).settings;
    }
}

interface Nodes {
    everyone: Omit<PermissionNode, 'id'>;
    roles: PermissionNode[];
    member: PermissionNode[];
}

interface ReturnNode {
    [k: string]: boolean | Record<string, boolean>;
}
