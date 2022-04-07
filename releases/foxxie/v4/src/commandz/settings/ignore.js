const { PaginatedMessage } = require('@foxxie/tails');
const { FoxxieCommand } = require('#structures');
const { User, Role, Permissions: { FLAGS } } = require('discord.js');
const { Promises: { resolveToNull } } = require(`#util`);
const { sendSuccess, sendError, send } = require('#messages');
const { languageKeys, t } = require('#i18n');

const getType = target => {
    return target instanceof User
        ? 'users'
        : target instanceof Role
            ? 'roles'
            : 'channels';
};

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            aliases: ['exempt'],
            requiredPermissions: [FLAGS.ADD_REACTIONS],
            permissions: [FLAGS.ADMINISTRATOR],
            usage: '(User:username|Channel:stricttextchannel|Role:rolename|list:default)'
        });
    }

    async run(msg, [target]) {
        if (target === 'list') return this.list(msg);

        const type = getType(target);
        const mod = msg.guild.settings.get(`mod.exempt.${type}`);
        if (mod.includes(target.id)) return sendError(msg, 'COMMAND_IGNORE_DUPLICATE', target.name || target.tag, type.substring(0, type.length - 1));
        msg.guild.settings.push(`mod.exempt.${type}`, target.id);
        return sendSuccess(msg);
    }

    async list(msg) {
        await resolveToNull(msg.guild.channels.fetch());
        const targets = [];

        for (const exempt of ['users', 'roles', 'channels']) {
            const arr = msg.guild.settings.get(`mod.exempt.${exempt}`);
            if (!arr.length) continue;
            arr.forEach(id => {
                const target = msg.client.users.cache.get(id) || msg.guild.channels.cache.get(id) || msg.guild.roles.cache.get(id);
                if (!target) return id;
                return targets.push(target);
            });
        }

        if (!targets.length) return sendError(msg, 'COMMAND_IGNORE_NONE');

        const actions = [PaginatedMessage.defaultActions[0], PaginatedMessage.defaultActions[2], PaginatedMessage.defaultActions[3], PaginatedMessage.defaultActions[4]];
        const display = new PaginatedMessage({ actions }).setPromptMessage(t(msg, languageKeys.system.reactionHandlerPrompt));

        let i0 = 0;
        let i1 = 10;
        const num = targets.length;

        for (let i = 0; i < num;) {
            if (!(i0 + 1 < 0) && !(i0 < 0 || !i1)) {
                const list = targets.map(target => {
                    const type = getType(target);
                    return msg.language.get('COMMAND_IGNORE_ITEM', type.substring(0, type.length - 1), target.tag || target.name);
                })
                    .slice(i0, i1)
                    .join('\n');

                i0 += 10;
                i1 += 10;

                display.addPageContent(msg.language.get('COMMAND_IGNORE_LIST', msg.guild.name, list));
            }
            i += 10;
        }

        if (display.pages.length === 1) return send(msg, display.pages[0].content);

        return display.run(msg);
    }

};
