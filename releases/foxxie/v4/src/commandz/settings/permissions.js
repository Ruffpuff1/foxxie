const { Permissions: { FLAGS } } = require('discord.js');
const { FoxxieCommand } = require('#structures');
const { emojis: { perms: { granted, denied, notSpecified } } } = require('#utils/Constants');
const { sendSuccess, sendLang, send } = require('#messages');
const { Util } = require('#util');

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            aliases: ['perms', 'permission'],
            usage: '(allow|deny|remove|clear|show:default) [Member:membername|Role:rolename|everyone] [Permission:string]',
            usageDelim: ' ',
            permissions: [FLAGS.ADMINISTRATOR]
        });
    }

    async run(message, [action, target, permission]) {
        if (!action) return sendLang(message, 'COMMAND_PERMS_HELP', Util.getPrefix(message));

        if (action === 'show') {
            if (!target) target = message.member;
            const tree = await this.client.permissions.handle({ action, message, target });
            const content = this.buildOverview(tree, target, message.language);
            return send(message, content.length > 2000 ? `${content.substring(0, 1995)}...` : content);
        }

        if (['allow', 'deny', 'remove'].includes(action) && (!target || !permission)) throw message.language.get('COMMAND_PERMS_MISSING');
        await this.client.permissions.handle({
            action,
            message,
            permission,
            target
        });
        if (action === 'clear') target = message.guild;
        return sendSuccess(message, `COMMAND_PERMS_SUCCESS_${action.toUpperCase()}`, permission === '*' ? 'everything' : permission, target?.name || target?.displayName || target);
    }

    buildOverview(tree, target, lang) {
        const out = [];
        const name = target.name === '@everyone'
            ? 'everyone'
            : target.name || target.displayName;

        out.push(lang.get('COMMAND_PERMS_SHOW', name), '');
        for (const category in tree) {
            if (category === 'admin') continue;
            out.push(`${typeof tree[category]['*'] === 'boolean'
                ? tree[category]['*']
                    ? granted
                    : denied
                : notSpecified
            } ${category}`);
            let i = 0;
            const keys = Object.keys(tree[category]).length;
            // eslint-disable-next-line guard-for-in
            for (const key in tree[category]) {
                i++;
                if (tree[category]['*'] === tree[category][key]) continue;
                out.push(`  ${i === keys ? '└──' : '├──'}${tree[category][key]
                    ? granted
                    : denied
                } ${key}`);
            }
        }
        return out.join('\n');
    }

};
