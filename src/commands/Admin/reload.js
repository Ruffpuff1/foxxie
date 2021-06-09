const { Command, Stopwatch, Language, Event } = require('foxxie');
const fs = require('fs');
const { Message } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'reload',
            aliases: ['r'],
            description: language => language.get('COMMAND_RELOAD_DESCRIPTION'),
            usage: '[Piece]',
            permissions: 'CLIENT_OWNER',
            category: 'admin',
        })
    }

    async run (message, [piece]) {

        if (!piece) return message.responder.error('COMMAND_RELOAD_NONE');
        const instance = this.client.commands.get(piece) || this.client.events.get(piece) || this.client.monitors.get(piece) || this.client.languages.get(piece);
        if (!instance) return;
       
        let value = await this._reload(message, instance, piece);
        if (value instanceof Message) return;
        const { time, type, name } = value;
        return message.responder.success(`COMMAND_RELOAD_SUCCESS`, name, type.toLowerCase(), time);
    }

    async _reload(msg, piece, instance) {

        const stopwatch = new Stopwatch();
        let folderName, newPiece, name = piece.name;

        if (piece instanceof Command) {
            const commandFolders = fs.readdirSync('src/commands');
            folderName = commandFolders.find(folder => fs.readdirSync(`src/commands/${folder}`).includes(`${name}.js`));
            delete require.cache[require.resolve(`../${folderName}/${name}.js`)];

            newPiece = require(`../${folderName}/${name}.js`);
            newPiece = new newPiece(this.client);
        }

        if (piece instanceof Event) delete require.cache[require.resolve(`../../events/${name}.js`)];
        if (msg.client.languages.get(instance)) delete require.cache[require.resolve(`../../languages/${instance}.js`)];
        if (msg.client.monitors.get(name)) delete require.cache[require.resolve(`../../monitors/${name}.js`)];

        try {
            
            if (piece instanceof Command) {
                msg.client.commands.set(newPiece);
                this.client.commands.init(newPiece.name)
                return { time: stopwatch.toString(), type: 'COMMAND', name: newPiece.name };
            }

            if (piece instanceof Language) {
                newPiece = require(`../../languages/${instance}.js`);
                newPiece = new newPiece(msg);
                msg.client.languages.set(instance, newPiece);
                return { time: stopwatch.toString(), type: 'LANGUAGE', name: instance }
            }

            if (piece instanceof Event) {
                newPiece = require(`../../events/${name}.js`);
                newPiece = new newPiece(this.client.events, `../../events/${name}`, `../../events`);
                await this.client.setEvent(newPiece);
                this.client._events[instance]?.shift();
                return { time: stopwatch.toString(), type: 'EVENT', name: instance }
            }

            if (msg.client.monitors.get(name)) {
                newPiece = require(`../../monitors/${name}.js`)
                msg.client.monitors.set(newPiece.name, newPiece);
                return { time: stopwatch.toString(), type: 'MONITOR', name: newPiece.name }
            }

        } catch (e) {
            return msg.responder.error('COMMAND_RELOAD_ERROR', name, `${e.name} ${e.message}`);
        }
    }
}