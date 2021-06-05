const Stopwatch = require('../../../lib/util/Stopwatch');
const Command = require('../../../lib/structures/Command');

module.exports = class extends Command {
    
    constructor(...args) {
        super(...args, {
            name: 'eval',
            aliases: ['ev'],
            description: language => language.get('COMMAND_EVAL_DESCRIPTION'),
            usage: 'fox eval (d=Number) (code) (-a|-s|-m)',
            permissionLevel: 9,
            category: 'admin',
        })
    }

    async run(message, args) {

        const client = this.client, msg = message;
        const stopwatch = new Stopwatch();
        const depth = /d=\d/i.test(args[0]) ? args[0].slice(2, 3) : 0;

        let code = depth === 0 ? args.slice(0).join(" ") : args.slice(1).join(" ");
        let silent = /(-silent|-s)/gi.test(code);
        let async = /(-async|-a)/gi.test(code);
        let mess = /(-message|-m)/gi.test(code);

        try {
            code = await this.codeReplace(code);
            if (async) code = `(async () => {\n${code}\n})`;
            let result = async ? eval(code) : await eval(code);
            let type = typeof result;

            if (result?.length < 1 && result) return message.channel.send(`${message.language.get('COMMAND_EVAL_OUTPUT')}\n\`\`\`js\n${message.language.get('COMMAND_EVAL_UNDEFINED')}\n\`\`\``);
            if (typeof result !== 'string') result = require('util').inspect(result, { depth });
            const syncTime = stopwatch.toString();

            if (!mess && !silent) return message.channel.send(`\n${message.language.get('COMMAND_EVAL_OUTPUT')}\n\`\`\`js\n${result.length > 1900 ? result.substring(0, 1900) : result}\n\`\`\`\n${message.language.get('COMMAND_EVAL_TYPE')}\n\`\`\`js\n${type}\n\`\`\`\n:stopwatch: ${syncTime}`);
            if (mess) return message.channel.send(result?.length > 1900 ? result.substring(0, 1900) : result);
        } catch (e) {

            const syncTime = stopwatch.toString();
            return message.channel.send(`\n${message.language.get('COMMAND_EVAL_OUTPUT')}\n\`\`\`js\n${e.message.length > 1900 ? e.message.substring(0, 1900) : e.message?.toString()}\n\`\`\`\n${message.language.get('COMMAND_EVAL_TYPE')}\n\`\`\`js\n${e.name}\n\`\`\`\n:stopwatch: ${syncTime}`);
        }
    }

    codeReplace(code) {
        return code
            .replace(/(-silent|-s)/gi, '')
            .replace(/(-async|-a)/gi, '')
            .replace(/(-message|-m)/gi, '');
    }
}