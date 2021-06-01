const math = require('mathjs');

module.exports = {
    name: "math",
    aliases: ['calculate', 'calc', 'calculator', 'convert'],
    usage: "fox math [query]",
    //category: 'utility',
    execute: async (props) => {

        let { message, args } = props;

        if (!args[0]) return message.channel.send("**Enter Something To Calculate**");

        let result;
        try {
            result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));
        } catch (e) {
            return message.channel.send("**Sorry,** that doesn't seem to be a valid calculation! For examples of valid calculations check `fox help math`.");
        }

        message.channel.send(`${args.join("").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/").replace('to', " => ")} = ${result}`);
    }
}