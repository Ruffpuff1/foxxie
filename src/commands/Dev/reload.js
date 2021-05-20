const { performance } = require('perf_hooks');
const fs = require('fs')
module.exports = {
    name: 'reload',
    aliases: ['r'],
    usage: 'fox reload [command|monitor|language]',
    permissionLevel: 9,
    category: 'developer',
    async execute (props) {

        const { message, args, lang } = props;

        const start = performance.now().toFixed(2);
        if (!args.length) return message.responder.error('COMMAND_RELOAD_NOARGS', lang);
        const command = message.client.commands.get(args[0].toLowerCase());
        const monitor = message.client.monitors.get(args[0].toLowerCase());
        const lang2 = message.client.languages.get(args[0]);

        if (command) return this._command(command, props, start);
        if (monitor) return this._monitor(monitor, props, start);
        if (lang2) return this._language(lang2, props, start);
        return message.responder.error('COMMAND_RELOAD_NOEXIST', lang, args[0]);
    },

    async _command(command, { message, language, lang }, start) {
        const commandFolders = fs.readdirSync('src/commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`src/commands/${folder}`).includes(`${command.name}.js`));
        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            const end = performance.now().toFixed(2);
            language.send('COMMAND_RELOAD_COMMAND_SUCCESS', lang, command.name, (end*1000 - start*1000).toLocaleString());
        } catch (e) {
            console.error(e);
            language.send('COMMAND_RELOAD_COMMAND_ERROR', lang, command.name, `${e.name} ${e.message}`);
        }
    },

    async _language(lang2, { message, language, lang }, start) {
        await delete require.cache[require.resolve(`../../languages/${lang2.name}.js`)];
        try {
        const reloaded = require(`../../languages/${lang2.name}`);
        message.client.languages.set(lang2.name, reloaded);
        const end = performance.now().toFixed(2);
        language.send('COMMAND_RELOAD_LANGUAGE_SUCCESS', lang, lang2.name, (end*1000 - start*1000).toLocaleString());
        } catch (e) {
            console.error(e);
            language.send('COMMAND_RELOAD_LANGUAGE_ERROR', lang, lang2.name, `${e.name} ${e.message}`);
        }
    },

    async _monitor(monitor, { message, language, lang }, start) {
        await delete require.cache[require.resolve(`../../monitors/${monitor.name}.js`)];
        try {
        const reloaded = require(`../../monitors/${monitor.name}`);
        message.client.monitors.set(reloaded.name, reloaded);
        const end = performance.now().toFixed(2);
        language.send('COMMAND_RELOAD_MONITOR_SUCCESS', lang, monitor.name, (end*1000 - start*1000).toLocaleString());
        } catch (e) {
            console.error(e);
            language.send('COMMAND_RELOAD_MONITOR_ERROR', lang, monitor.name, `${e.name} ${e.message}`);
        }
    }
}