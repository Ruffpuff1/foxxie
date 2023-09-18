import { GuildSettings, PermissionNode } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { GuildMessage, PermissionLevels } from '#lib/Types';
import { messagePrompt } from '#utils/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Role } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['perm', 'permissions', 'perms'],
    runIn: CommandOptionsRunTypeEnum.GuildText,
    permissionLevel: PermissionLevels.Administrator,
    subcommands: [
        { name: 'show', default: true, messageRun: 'messageRunShow' },
        { name: 'allow', messageRun: 'messageRunAllow' }
    ]
})
export class UserCommand extends FoxxieCommand {
    public async messageRunShow(message: GuildMessage, args: FoxxieCommand.Args) {
        const target = (await this.resolveArgument(message, args)) || message.member;
        const content = await this.container.utilities.guild(message.guild).permissions.showNodes(target);

        await send(message, content);
    }

    public async messageRunAllow(message: GuildMessage, args: FoxxieCommand.Args) {
        const target = await this.resolveArgument(message, args);
        if (!target) this.error('commands/configuration:permissionNoTarget');

        const permissionNode = await args.pick('string');

        const { settings } = this.container.utilities.guild(message.guild);

        if (target instanceof Role) {
            const isEveryone = target.id === message.guild.id;

            if (isEveryone) await messagePrompt(message, 'commands/configuration:permissionAllowingForEveryone');

            await settings.set(entity => {
                const roleNodes = entity[GuildSettings.PermissionNodes.Roles];

                const oldNode = roleNodes.find(role => role.id === target.id);
                console.log(oldNode);
                if (!oldNode) {
                    const newNode: PermissionNode = {
                        id: target.id,
                        allowed: [permissionNode],
                        denied: []
                    };
                    console.log(newNode);

                    entity[GuildSettings.PermissionNodes.Roles].push(newNode);
                    return;
                }

                const index = roleNodes.indexOf(oldNode);
                console.log(index);
                oldNode.allowed.push(permissionNode);

                entity[GuildSettings.PermissionNodes.Roles][index] = oldNode;

                console.log(roleNodes);
            });

            await send(message, 'set perms');
        }
    }

    private resolveArgument(message: GuildMessage, args: FoxxieCommand.Args) {
        return args.pick('role').catch(() =>
            args.pick('member').catch(() =>
                args
                    .pick('string')
                    .then(s =>
                        s === args.t(LanguageKeys.Globals.Everyone) ? message.guild.roles.cache.get(message.guildId)! : null
                    )
                    .catch(() => null)
            )
        );
    }
}
