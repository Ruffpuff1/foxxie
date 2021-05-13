const foxxie = require('../../../config/foxxie')
const { performance } = require('perf_hooks');
const fs = require('fs')
module.exports = {
    name: 'reload',
    aliases: ['r'],
    usage: 'fox reload [command|monitor]',
    category: 'developer',
    execute: async(props) => {

        let { message, args, lang, language} = props

        if (!foxxie.owner.includes(message.author.id)) return;
        const start = performance.now().toFixed(2);
        if (!args.length) return message.channel.send(language.get('COMMAND_RELOAD_NOARGS', lang));
        const command = message.client.commands.get(args[0].toLowerCase());
        const monitor = message.client.monitors.get(args[0].toLowerCase());
        if (command) return _command(command);
        if (monitor) return _monitor(monitor);
        return message.channel.send(language.get('COMMAND_RELOAD_NOEXIST', lang, args[0]));

        async function _monitor(monitor) {
            await delete require.cache[require.resolve(`../../monitors/${monitor.name}.js`)];
            try {
            const reloaded = require(`../../monitors/${monitor.name}`);
            message.client.monitors.set(reloaded.name, reloaded);
            const end = performance.now().toFixed(2);
            message.channel.send(language.get('COMMAND_RELOAD_MONITOR_SUCCESS', lang, monitor.name, (end*1000 - start*1000).toLocaleString()));
            } catch (e) {
                console.error(e);
                message.channel.send(language.get('COMMAND_RELOAD_MONITOR_ERROR', lang, monitor.name, `${e.name} ${e.message}`))
            }
        }

        async function _command(command) {
            const commandFolders = fs.readdirSync('src/commands');
            const folderName = commandFolders.find(folder => fs.readdirSync(`src/commands/${folder}`).includes(`${command.name}.js`));
            delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

            try {
                const newCommand = require(`../${folderName}/${command.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
                const end = performance.now().toFixed(2);
                message.channel.send(language.get('COMMAND_RELOAD_COMMAND_SUCCESS', lang, command.name, (end*1000 - start*1000).toLocaleString()));
            } catch (e) {
                console.error(e);
                message.channel.send(language.get('COMMAND_RELOAD_COMMAND_ERROR', lang, command.name, `${e.name} ${e.message}`))
            }
        }
    }
}