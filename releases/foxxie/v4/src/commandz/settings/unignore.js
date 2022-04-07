const { FoxxieCommand } = require('#structures');
const { User, Role, Permissions: { FLAGS } } = require('discord.js');
const { sendSuccess, sendError } = require('#messages');

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
            aliases: ['unexempt'],
            requiredPermissions: [FLAGS.ADD_REACTIONS],
            permissions: [FLAGS.ADMINISTRATOR],
            usage: '[User:username|Channel:stricttextchannel|Role:rolename|list:default]'
        });
    }

    async run(msg, [target]) {
        const { list } = this.client.commands.get('exempt');
        if (target === 'list') return list(msg);

        const type = getType(target);
        const mod = msg.guild.settings.get(`mod.exempt.${type}`);
        if (!mod.includes(target.id)) return sendError(msg, 'COMMAND_UNEXEMPT_NOEXIST', target.name || target.tag, type.substring(0, type.length - 1));
        msg.guild.settings.pull(`mod.exempt.${type}`, target.id);
        return sendSuccess(msg);
    }

};
