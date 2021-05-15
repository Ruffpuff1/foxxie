const { emojis: { perms: { granted, denied, notSpecified } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'settings',
    aliases: ['setting'],
    usage: 'fox settings (welcome|goodbye|log|starboard|disboard|anti|blacklist)',
    permissions: 'MANAGE_MESSAGES',
    category: 'settings',
    execute: async(props) => {

        let { lang, message, args, language } = props
        const loading = await language.send("MESSAGE_LOADING", lang);
        let settings = await message.guild.settings.get();
        if (/(welcome|join)/i.test(args[0])) return _welcomeSettings(settings?.welcome, 'welcome');
        if (/(goodbye|bye|leave)/i.test(args[0])) return _goodbyeSettings(settings?.goodbye, 'goodbye');
        if (/(log|logging|logger)/i.test(args[0])) return _loggerSettings(settings?.log, 'logger');
        if (/(star|starboard)/i.test(args[0])) return _starboardSettings(settings?.starboard, 'starboard');
        if (/(bump|disboard)/i.test(args[0])) return _disboardSettings(settings?.disboard, 'disboard');
        if (/(anti|antis|auto|automod)/i.test(args[0])) return _antiSettings(settings?.mod?.anti, 'automod');
        if (/(blacklist|users|perms)/i.test(args[0])) return _userSettings(settings?.blockedUsers, 'user');
        return _settingsAll(settings);

        async function _settingsAll(settings) {
            let arr = [language.get('COMMAND_SETTINGS_TITLE', lang, message.guild.name, null, language, lang)]

            if (settings?.prefixes?.length) arr.push(language.get('COMMAND_SETTINGS_PREFIX', lang, granted, settings?.prefixes.length, settings?.prefixes?.length === 1 ? `\`${settings?.prefixes[0]}\`` : settings?.prefixes.map(p => `\`${p}\``)))
            if (settings?.welcome?.channel) arr.push(language.get('COMMAND_SETTINGS_WELCOMES', lang, granted, 'enabled', lang, language)); 
            if (settings?.goodbye?.channel) arr.push(language.get('COMMAND_SETTINGS_GOODBYES', lang, granted, 'enabled', lang, language));
            if (settings?.log?.mod?.channel || settings?.log?.edit?.channel || settings?.log?.delete?.channel || settings?.log?.invite?.channel || settings?.log?.commands?.channel) arr.push(language.get('COMMAND_SETTINGS_LOGGERS', lang, granted, 'enabled', lang, language));
            if (settings?.starboard?.channel) arr.push(language.get('COMMAND_SETTINGS_STARBOARDS', lang, granted, 'enabled', lang, language));
            if (settings?.disboard?.channel) arr.push(language.get('COMMAND_SETTINGS_DISBOARDS', lang, granted, 'enabled', lang, language));
            if (settings?.mod?.anti && Object.keys(settings?.mod?.anti).length) arr.push(`${granted} **${Object.keys(settings?.mod?.anti).length}** Anti${Object.keys(settings?.mod?.anti).length > 1 ? 's' : ''} currently **enabled**`);
            if (settings?.blockedUsers?.length) arr.push(language.get('COMMAND_SETTINGS_BLOCKED_USERS', lang, settings?.blockedUsers?.length))

            message.channel.send(arr.length > 1 ? arr.join('\n') : language.get('COMMAND_SETTINGS_NONE', lang));
            return loading.delete();
        }

        async function _welcomeSettings(welcome, setting) {
            let arr = [language.get('COMMAND_SETTINGS_TITLE', lang, message.guild.name, setting, language, lang)]
            if (welcome?.channel) arr.push(language.get('COMMAND_SETTINGS_WELCOMES', lang, granted, 'enabled', lang, language), language.get('COMMAND_SETTINGS_SIDE_CHANNEL', lang, granted, welcome?.channel));
            else arr.push(language.get('COMMAND_SETTINGS_WELCOMES', lang, notSpecified, 'notenabled', lang, language))

            if (welcome?.message) arr.push(language.get('COMMAND_SETTINGS_SIDE_MESSAGE', lang, granted, welcome?.message.substring(0, 12)))
            if (welcome?.ping) arr.push(language.get('COMMAND_SETTINGS_SIDE_PING', lang, message.guild.roles.cache.get(welcome?.ping).name));
    
            message.channel.send(arr.join('\n'));
            return loading.delete();
        }

        async function _goodbyeSettings(goodbye, setting) {
            let arr = [language.get('COMMAND_SETTINGS_TITLE', lang, message.guild.name, setting, language, lang)]
            if (goodbye?.channel) arr.push(language.get('COMMAND_SETTINGS_GOODBYES', lang, granted, 'enabled', lang, language), language.get('COMMAND_SETTINGS_SIDE_CHANNEL', lang, granted, goodbye?.channel));
            else arr.push(language.get('COMMAND_SETTINGS_GOODBYES', lang, notSpecified, 'notenabled', lang, language))

            if (goodbye?.message) arr.push(language.get('COMMAND_SETTINGS_SIDE_MESSAGE', lang, granted, goodbye?.message.substring(0, 12)))
    
            message.channel.send(arr.join('\n'));
            return loading.delete();
        }

        async function _loggerSettings(log, setting) {
            let arr = [language.get('COMMAND_SETTINGS_TITLE', lang, message.guild.name, setting, language, lang)]
            if (log?.mod?.channel || log?.edit?.channel || log?.delete?.channel || log?.invite?.channel || log?.commands?.channel) arr.push(language.get('COMMAND_SETTINGS_LOGGERS', lang, granted, 'enabled', lang, language)); 
            else arr.push(language.get('COMMAND_SETTINGS_LOGGERS', lang, notSpecified, 'notenabled', lang, language))

            if (log?.mod?.channel) arr.push(language.get('COMMAND_SETTINGS_LOGGER_MODERATION', lang, log?.mod?.channel));
            if (log?.edit?.channel) arr.push(language.get('COMMAND_SETTINGS_LOGGER_EDIT', lang, log?.edit?.channel));
            if (log?.delete?.channel) arr.push(language.get('COMMAND_SETTINGS_LOGGER_DELETE', lang, log?.delete?.channel));
            if (log?.invite?.channel) arr.push(language.get('COMMAND_SETTINGS_LOGGER_INVITE', lang, log?.invite?.channel));
            if (log?.commands?.channel) arr.push(language.get('COMMAND_SETTINGS_LOGGER_COMMAND', lang, log?.commands?.channel));
    
            message.channel.send(arr.join('\n'));
            return loading.delete();
        }

        async function _starboardSettings(starboard, setting) {
            let arr = [language.get('COMMAND_SETTINGS_TITLE', lang, message.guild.name, setting, language, lang)]
            if (starboard?.channel) arr.push(language.get('COMMAND_SETTINGS_STARBOARDS', lang, granted, 'enabled', lang, language), language.get('COMMAND_SETTINGS_SIDE_CHANNEL', lang, granted, starboard?.channel));
            else arr.push(language.get('COMMAND_SETTINGS_STARBOARDS', lang, notSpecified, 'notenabled', lang, language))

            if (starboard?.minimum) arr.push(language.get('COMMAND_SETTINGS_STARBOARD_MINIMUM', lang, starboard?.minimum))
            if (starboard?.self === false) arr.push(language.get('COMMAND_SETTINGS_STARBOARD_SELF', lang));
            if (starboard?.notifications === false) arr.push(language.get('COMMAND_SETTINGS_STARBOARD_NOTIFICATIONS', lang));
            if (starboard?.nostar?.length) arr.push(language.get('COMMAND_SETTINGS_STARBOARD_NOSTAR', lang, starboard?.nostar?.length, starboard?.nostar?.map(c => `<#${c}>`).join(", ")))
    
            message.channel.send(arr.join('\n'));
            return loading.delete();
        }

        async function _disboardSettings(disboard, setting) {
            let arr = [language.get('COMMAND_SETTINGS_TITLE', lang, message.guild.name, setting, language, lang)]
            if (disboard?.channel) arr.push(language.get('COMMAND_SETTINGS_DISBOARDS', lang, granted, 'enabled', lang, language), language.get('COMMAND_SETTINGS_SIDE_CHANNEL', lang, granted, disboard?.channel));
            else arr.push(language.get('COMMAND_SETTINGS_DISBOARDS', lang, notSpecified, 'notenabled', lang, language))

            if (disboard?.message) arr.push(language.get('COMMAND_SETTINGS_SIDE_MESSAGE', lang, granted, disboard?.message.substring(0, 12)))
            if (disboard?.ping) arr.push(language.get('COMMAND_SETTINGS_SIDE_PING', lang, message.guild.roles.cache.get(disboard?.ping).name))
    

            message.channel.send(arr.join('\n'));
            return loading.delete();
        }

        async function _antiSettings(anti, setting) {
            let arr = [language.get('COMMAND_SETTINGS_TITLE', lang, message.guild.name, setting, language, lang)]
            arr.push(language.get('COMMAND_SETTINGS_AUTOMODS', lang, settings?.anti ? Object.keys(settings?.anti).length : null))

            if (anti?.invite) arr.push(language.get('COMMAND_SETTINGS_AUTOMOD_INVITES', lang));
            if (anti?.image) arr.push(language.get('COMMAND_SETTINGS_AUTOMOD_IMAGES', lang));
            if (anti?.gift) arr.push(language.get('COMMAND_SETTINGS_AUTOMOD_GIFTS', lang));

            message.channel.send(arr.join('\n'));
            return loading.delete();
        }

        async function _userSettings(blocked, setting) {

            let arr = [language.get('COMMAND_SETTINGS_TITLE', lang, message.guild.name, setting, language, lang)]

            let blk = [];
            for (let user of settings.blockedUsers){
                let u = message.guild.members.cache.get(user)
                blk.push(`**${u.user.tag}**`)
            }

            arr.push(language.get('COMMAND_SETTINGS_BLOCKED_USERS', lang, blocked?.length, blk.map(u => `└─ ${denied} **${u}**`).join('\n')))

            message.channel.send(arr.join('\n'));
            return loading.delete();
        }
    } 
}