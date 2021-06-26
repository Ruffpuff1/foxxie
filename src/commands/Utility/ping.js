const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ping',
            aliases: ['pong', 'latency', 'lagg', 'lag'],
            description: language => language.get('COMMAND_PING_DESCRIPTION'),
            category: 'utility',
        })
    }

    async run(message) {
                
        const msg = await message.responder.success('COMMAND_PING');
        const wsPing = Math.round(this.client.ws.ping);
        const roundTrip = (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp);

        const discordLatency = roundTrip;

        const totalLatency = discordLatency + wsPing;

        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(700);

        return msg.edit(message.language.get('COMMAND_PINGPONG', 
            totalLatency,
            discordLatency, 
            wsPing
        ));
    }
}