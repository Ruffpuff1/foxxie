const { Monitor, Stopwatch } = require('@foxxie/tails');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            ignoreOthers: false,
            ignoreEdits: false
        })
    }

    async run(msg) {
        if (msg.guild && !msg.guild.me) await msg.guild.members.fetch(this.client.user);
        if (!msg.channel.postable) return undefined;
        msg.prefix = await msg.prefix;
        msg.prefixes = await msg.getPrefix();
        msg.prefixes.shift();

        const stringPrefixes = msg.prefixes.slice(0, -1).map(p => `\`${p.toString().replace(/(\\s|\\|\/i|\/|\^)/g, '')}\``).join(', ');

        if (!msg.commandText && msg.prefix === `<@!${this.client.user.id}>`) {
            return msg.responder.success('PREFIX_REMINDER', stringPrefixes, msg.prefixes.pop().toString().replace(/(\\s|\\|\/i|\/|\^)/g, ''));
        }
        if (!msg.commandText) return undefined;
        if (!msg.command) return this.client.emit('commandUnknown', msg, msg.commandName, msg.prefix, msg.prefix.length);
        //this.client.emit('commandRun', msg, msg.command, msg.args);

		return this.runCommand(msg);
    }

    async runCommand(msg) {
        const timer = new Stopwatch();
        if (this.client.options.typing) msg.channel.startTyping();
        try {
            await this.client.inhibitors.run(msg, msg.command);
            try {
                const response = await msg.command.run(msg, msg.args);
                timer.stop();
                this.client.emit('commandSuccess', msg, msg.command, msg.args, response);
            } catch (error) {
                this.client.emit('commandError', msg, msg.command, msg.args, error);
            }
        } catch (response) {
            this.client.emit('commandInhibited', msg, msg.command, response);
        }
        if (this.client.options.typing) msg.channel.stopTyping();
    }
}