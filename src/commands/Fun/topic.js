const req = require('@aero/centra'); 
const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'topic',
            aliases: ['conversationstarter', 'conversationstarters', 'topics'],
            description: language => language.get('COMMAND_TOPIC_DESCRIPTION'),
            category: 'fun',
        })

        this.baseURL = 'https://www.conversationstarters.com/random.php';
    }

    async run(msg) {
        const text = await req(this.baseURL)
            .text()
            .then(this.process);
        
        msg.channel.send(text);
    }

    process(text) {
        return text.slice(39);
    }
}