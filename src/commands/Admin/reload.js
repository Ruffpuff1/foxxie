const { performance } = require('perf_hooks');
const fs = require('fs')
module.exports = {
    name: 'reload',
    aliases: ['r'],
    usage: 'fox reload [command|monitor|language]',
    permissionLevel: 9,
    category: 'developer',
    async execute (props) {

        const { message, args } = props;

        const start = performance.now().toFixed(2);
        if (!args.length) return message.responder.error('COMMAND_RELOAD_NOARGS');
        const command = message.client.commands.get(args[0].toLowerCase());
        const monitor = message.client.monitors.get(args[0].toLowerCase());
        const lang2 = message.client.languages.get(args[0]);

        if (command) return this._command(command, props, start);
        if (monitor) return this._monitor(monitor, props, start);
        if (lang2) return this._language(lang2, props, start);
        return message.responder.error('COMMAND_RELOAD_NOEXIST', args[0]);
    },

    async _command(command, { message }, start) {
        const commandFolders = fs.readdirSync('src/commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`src/commands/${folder}`).includes(`${command.name}.js`));
        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            const end = performance.now().toFixed(2);
            message.responder.success('COMMAND_RELOAD_COMMAND_SUCCESS', command.name, (end*1000 - start*1000).toLocaleString());
        } catch (e) {
            console.error(e);
            message.responder.error('COMMAND_RELOAD_COMMAND_ERROR', command.name, `${e.name} ${e.message}`);
        }
    },

    async _language(lang2, { message }, start) {
        await delete require.cache[require.resolve(`../../languages/${lang2.name}.js`)];
        try {
        const reloaded = require(`../../languages/${lang2.name}`);
        message.client.languages.set(lang2.name, reloaded);
        const end = performance.now().toFixed(2);
        message.responder.success('COMMAND_RELOAD_LANGUAGE_SUCCESS', lang2.name, (end*1000 - start*1000).toLocaleString());
        } catch (e) {
            console.error(e);
            message.responder.error('COMMAND_RELOAD_LANGUAGE_ERROR', lang2.name, `${e.name} ${e.message}`);
        }
    },

    async _monitor(monitor, { message }, start) {
        await delete require.cache[require.resolve(`../../monitors/${monitor.name}.js`)];
        try {
            const reloaded = require(`../../monitors/${monitor.name}`);
            message.client.monitors.set(reloaded.name, reloaded);
            const end = performance.now().toFixed(2);
            message.responder.success('COMMAND_RELOAD_MONITOR_SUCCESS', monitor.name, (end*1000 - start*1000).toLocaleString());
        } catch (e) {
            console.error(e);
            message.responder.error('COMMAND_RELOAD_MONITOR_ERROR', monitor.name, `${e.name} ${e.message}`);
        }
    }
}