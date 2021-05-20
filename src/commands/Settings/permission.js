module.exports = {
    name: 'permission',
    aliases: ['permissions', 'perms', 'perm'],
    usage: 'fox permission [allow|deny|clear] (user|userId)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    async execute (props) {

        let { lang, message, args, language } = props;
        mem = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if (/(deny|block|blacklist)/i.test(args[0])) return this._denyPerms(props);
        if (/(allow|grant|whitelist)/i.test(args[0])) return this._allowPerms(props);
        if (/(reset|clear)/i.test(args[0])) return this._resetPerms(props);
        return language.send('COMMAND_PERMISSION_INVALIDUSE', lang);
    }, 

    _denyPerms({ message, language, lang }) {
        if (!mem) return language.send('COMMAND_PERMISSION_NOMEMBER', lang);
        message.guild.settings.push('blockedUsers', mem.user.id);
        return message.responder.success();
    }, 

    _allowPerms({ message, language, lang }) {
        if (!mem) return language.send('COMMAND_PERMISSION_NOMEMBER', lang);
        message.guild.settings.pull('blockedUsers', mem.user.id);
        return message.responder.success();
    },

    async _resetPerms({ message, language, lang }) {

        const loading = await language.send("MESSAGE_LOADING", lang);
        function confirmed() {
            message.guild.settings.unset('blockedUsers');
            loading.delete();
            return message.responder.success();
        }
        loading.confirm(loading, 'COMMAND_PERMISSION_CONFIRM', lang, message, confirmed);
    }
}