const Command = require('../../../lib/structures/Command');
const Stopwatch = require('../../../lib/util/Stopwatch');
const fs = require('fs');
const { Message } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'reload',
            aliases: ['r'],
            description: language => language.get('COMMAND_RELOAD_DESCRIPTION'),
            usage: 'fox reload [command|monitor|language]',
            permissionLevel: 9,
            category: 'admin',
        })
    }

    async run (message, [piece]) {

        if (!piece) return message.responder.error('COMMAND_RELOAD_NOARGS');
        const instance = this.client.commands.get(piece) || this.client.monitors.get(piece) || this.client.languages.get(piece);
        if (!instance) return;
       
        let value = await this._reload(message, instance);
        if (value instanceof Message) return;
        const { time, type, name } = value;
        return message.responder.success(`COMMAND_RELOAD_${type.toUpperCase()}_SUCCESS`, name, time);
    }

    async _reload(msg, piece) {

        const stopwatch = new Stopwatch();
        let folderName, newPiece, name = piece.name;

        if (piece instanceof Command) {
            const commandFolders = fs.readdirSync('src/commands');
            folderName = commandFolders.find(folder => fs.readdirSync(`src/commands/${folder}`).includes(`${name}.js`));
            delete require.cache[require.resolve(`../${folderName}/${name}.js`)];

            newPiece = require(`../${folderName}/${name}.js`);
            newPiece = new newPiece(msg.language);
        }

        if (msg.client.languages.get(name)) delete require.cache[require.resolve(`../../languages/${name}.js`)];
        if (msg.client.monitors.get(name)) delete require.cache[require.resolve(`../../monitors/${name}.js`)];

        try {
            
            if (piece instanceof Command) {
                msg.client.commands.set(newPiece.name, newPiece);
                return { time: stopwatch.toString(), type: 'COMMAND', name };
            }

            if (msg.client.languages.get(name)) {
                newPiece = require(`../../languages/${name}.js`)
                msg.client.languages.set(newPiece.name, newPiece);
                return { time: stopwatch.toString(), type: 'LANGUAGE', name }
            }

            if (msg.client.monitors.get(name)) {
                newPiece = require(`../../monitors/${name}.js`)
                msg.client.monitors.set(newPiece.name, newPiece);
                return { time: stopwatch.toString(), type: 'MONITOR', name }
            }

        } catch (e) {
            return msg.responder.error('COMMAND_RELOAD_ERROR', name, `${e.name} ${e.message}`);
        }
    }
}