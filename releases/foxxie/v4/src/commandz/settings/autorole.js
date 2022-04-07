const { PaginatedMessage } = require('@foxxie/tails');
const { FoxxieCommand } = require('#structures');
const { Permissions: { FLAGS } } = require('discord.js');
const { Util: { andArray } } = require('#util');
const { sendSuccess, sendError, sendLoading } = require('#messages');
const { languageKeys, t } = require('#i18n');

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            aliases: ['ar'],
            usage: '<add|remove|list:default> [all|Roles:rolenames]',
            permissions: [FLAGS.MANAGE_ROLES],
            requiredPermissions: [FLAGS.MANAGE_ROLES],
            subcommands: true,
            usageDelim: ' '
        });
    }

    async add(msg, [roles]) {
        if (roles === 'all') return sendError(msg, 'COMMAND_AUTOROLE_NOADDALL');
        if (!roles?.length) return this.noRoles(msg, 'ADD');
        const loading = await sendLoading(msg);

        const added = [];
        await msg.guild.settings.sync();
        const autoroles = msg.guild.settings.get(`mod.roles.auto`);
        for (const role of roles) {
            if (autoroles.includes(role.id)) continue;
            await msg.guild.settings.push('mod.roles.auto', role.id);
            added.push(role);
        }
        if (!added.length) return this.noRoles(msg, 'ADDED', roles).then(() => loading.delete());
        await sendSuccess(msg, 'COMMAND_AUTOROLE_ADDED', andArray(added, { mapper: role => `**${role.name}**` }));
        return loading.delete();
    }

    async remove(msg, [roles]) {
        const loading = await sendLoading(msg);
        if (roles === 'all') {
            await msg.guild.settings.unset(`mod.roles.auto`);
            return sendSuccess(msg, 'COMMAND_AUTOROLE_ALL');
        }
        if (!roles?.length) return this.noRoles(msg, 'ADD');

        const removed = [];
        await msg.guild.settings.sync();
        const autoroles = msg.guild.settings.get(`mod.roles.auto`);
        for (const role of roles) {
            if (!autoroles.includes(role.id)) continue;
            await msg.guild.settings.pull('mod.roles.auto', role.id);
            removed.push(role);
        }
        if (!removed.length) return this.noRoles(msg, 'REMOVED', roles).then(() => loading.delete());
        await sendSuccess(msg, 'COMMAND_AUTOROLE_REMOVED', andArray(removed, { mapper: role => `**${role.name}**` }));
        return loading.delete();
    }

    async list(msg) {
        const autoroleIDs = msg.guild.settings.get(`mod.roles.auto`);
        if (!autoroleIDs.length) return this.noRoles(msg, 'NE');
        const actions = [PaginatedMessage.defaultActions[0], PaginatedMessage.defaultActions[2], PaginatedMessage.defaultActions[3], PaginatedMessage.defaultActions[4]];
        const display = new PaginatedMessage({ actions }).setPromptMessage(t(msg, languageKeys.system.reactionHandlerPrompt));

        let i0 = 0;
        let i1 = 10;
        const num = autoroleIDs.length;

        for (let i = 0; i < num;) {
            if (!(i0 + 1 < 0) && !(i0 < 0 || !i1)) {
                const list = autoroleIDs.map(id => `- **${msg.guild.roles.cache.get(id).name}**`)
                    .slice(i0, i1)
                    .join('\n');

                i0 += 10;
                i1 += 10;

                display.addPageContent(msg.language.get('COMMAND_AUTOROLE_LIST', msg.guild.name, list));
            }
            i += 10;
        }

        if (display.pages.length === 1) return msg.send(display.pages[0].content);

        return display.run(msg);
    }

    noRoles(msg, action, roles) {
        return sendError(msg, `COMMAND_AUTOROLE_NO${action.toUpperCase()}`, roles?.length);
    }

};