const { code, Monitor, Stopwatch } = require('foxxie');
const { prefix: { production, development } } = require('../../config/foxxie');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            monitor: 'commandHandler',
            ignoreBlacklistedUsers: true
        })
    }

    async run(msg) {
        
        if (msg.guild && !msg.guild.me) await msg.guild.members.fetch(this.client.user);
        if (!msg.channel.postable) return undefined;
        if (!msg.commandText && msg.prefix === `<@!${this.client.user.id}>`) {
            return msg.responder.success('PREFIX_REMINDER', msg.stringPrefixes.filter(p => p !== `<@!${this.client.user.id}>`).slice(0, -1).map(p => `${code`${p}`}`).join(', '), msg.stringPrefixes.pop());
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