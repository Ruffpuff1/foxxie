const { Command, evaluate } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'math',
            aliases: ['calculate', 'calc', 'calculator', 'convert'],
            description: language => language.get('COMMAND_MATH_DESCRIPTION'),
            usage: '[Query]',
            category: 'utility'
        })
    }

    async run(message, [...query]) {
        if (!query?.length) return message.responder.error('COMMAND_MATH_NOARGS');

        try {
            let result = evaluate(query.join(" ").replace(/[,]/gi, '').replace(/[x]/gi, "*").replace(/[÷]/gi, "/"));
            message.channel.send(`${query.join("").replace(/[x]/gi, "*").replace(/[÷]/gi, "/").replace('to', " => ")} = ${result}`);
        } catch {
            return message.responder.error('COMMAND_MATH_INVALID');
        }
    }
}