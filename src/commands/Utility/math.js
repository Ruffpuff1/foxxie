const math = require('mathjs');

module.exports = {
    name: "math",
    aliases: ['calculate', 'calc', 'calculator', 'convert'],
    usage: "fox math [query]",
    category: 'utility',
    execute: async ({ message, args }) => {

        if (!args[0]) return message.responder.error('COMMAND_MATH_NOARGS');

        try {
            let result = math.evaluate(args.join(" ").replace(/[,]/gi, '').replace(/[x]/gi, "*").replace(/[÷]/gi, "/"));
            message.channel.send(`${args.join("").replace(/[x]/gi, "*").replace(/[÷]/gi, "/").replace('to', " => ")} = ${result}`);
        } catch (e) {
            return message.responder.error('COMMAND_MATH_INVALID');
        }
    }
}