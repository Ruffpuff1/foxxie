import { FoxxieCommand } from '../../lib/structures';
import type { GuildMessage } from '../../lib/types/Discord';
import { Message, MessageEmbed, Permissions } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';
import { aquireSettings, GuildEntity, guildSettings, LevelingRole, writeSettings } from '../../lib/database';
import { BrandingColors, sendLoading } from '../../lib/util';
import { chunk } from '@ruffpuff/utilities';
import { PaginatedMessage } from '../../lib/discord';
import { send } from '@sapphire/plugin-editable-commands';

const points = (level: number) => Math.floor((level / 0.2) ** 2);
const levels = (points: number) => Math.floor(0.2 * Math.sqrt(points));

const SORT = (x: LevelingRole, y: LevelingRole) => Number(x.points > y.points) || Number(x.points === y.points) - 1;

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['lvlrole', 'levelrole'],
    description: languageKeys.commands.leveling.levelrolesDescription,
    detailedDescription: languageKeys.commands.leveling.levelrolesExtendedUsage,
    requiredUserPermissions: [Permissions.FLAGS.MANAGE_GUILD],
    subCommands: ['add', 'remove', { input: 'show', default: true }]
})
export default class extends FoxxieCommand {

    async add(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const role = await args.pick('role');
        const level = await args.pick('integer');

        await writeSettings(msg.guild, (settings: GuildEntity) => {
            const lvlRoles = settings[guildSettings.leveling.roles];
            if (lvlRoles.some(lvlRole => lvlRole.id === role.id)) this.error(languageKeys.commands.leveling.levelrolesAlready, { role: role.toString() });

            const sorted = [...lvlRoles, { id: role.id, points: points(level) }].sort(SORT);

            settings[guildSettings.leveling.roles] = sorted;
        });

        return send(msg, args.t(languageKeys.commands.leveling.levelrolesAddSuccess, { role: role.toString(), level }));
    }

    async remove(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const role = await args.pick('role');
        let level;

        await writeSettings(msg.guild, (settings: GuildEntity) => {
            const lvlRoles = settings[guildSettings.leveling.roles];
            const index = lvlRoles.findIndex(levelRole => levelRole.id === role.id);
            if (index === -1) this.error(languageKeys.commands.leveling.levelrolesNoExist, { role: role.toString() });

            level = levels(lvlRoles[index].points);

            settings[guildSettings.leveling.roles].splice(index, 1);
        });

        return send(msg, args.t(languageKeys.commands.leveling.levelrolesRemoveSuccess, { role: role.toString(), level }));
    }

    async show(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const roles = await aquireSettings(msg.guild, guildSettings.leveling.roles) as LevelingRole[];
        if (!roles.length) this.error(languageKeys.commands.leveling.levelrolesNone);

        roles.sort(SORT);

        const loading = await sendLoading(msg);
        const template = new MessageEmbed()
            .setAuthor(msg.guild.name, msg.guild.iconURL({ dynamic: true }) as string)
            .setColor(msg.guild?.me?.displayColor || BrandingColors.Primary);

        const display = new PaginatedMessage({ template })
            .setPromptMessage(args.t(languageKeys.system.reactionHandlerPrompt));

        for (const page of chunk(roles as LevelingRole[], 10)) {
            const description = page.map((role: LevelingRole) => {
                const value = Math.floor(0.2 * Math.sqrt(role.points));
                const _role = msg.guild.roles.cache.get(role.id);

                return `**${args.t(languageKeys.commands.leveling.level)} ${args.t(languageKeys.globals.numberFormat, { value })}** - ${_role?.toString()}`;
            }).join('\n');

            display.addPageEmbed(embed => embed.setDescription(description));
        }

        await display.run(msg, msg.author);
        return loading.delete();
    }

}