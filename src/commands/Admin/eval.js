const Stopwatch = require('../../../lib/util/Stopwatch'), 
Type = require('../../../lib/util/Type'),
util = require('../../../lib/util/util');
const Command = require('../../../lib/structures/Command');
const { inspect } = require('util');

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

        this.silent = /(-silent|-s)/gi;
        this.message = /(-message|-m)/gi;
        this.async = /(-async|-a)/gi;
    }

    async run(message, code) {

        this.depth = /d=\d/i.test(code[0]) ? parseInt(code[0].slice(2, 3)) : 0;
        code = this.depth === 0 ? code.slice(0).join(' ') : args.slice(1).join(' ');

        const { success, result, time, type } = await this.eval(message, code);
        const footer = util.codeBlock('ts', type);
        let output = message.language.get(success ? 'COMMAND_EVAL_OUTPUT' : 'COMMAND_EVAL_ERROR',
                time, util.codeBlock('js', result > 1900 ? result.substring(0, 1900) : result), footer);
        if (this.silent.test(message.content)) return null;
        if (this.message.test(message.content)) output = result > 1900 ? result.substring(0, 1900) : result

        return message.channel.send(output);
    }

    async eval(message, code) {

        const msg = message, client = this.client;
        code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
        code = await this.codeReplace(code);
        const stopwatch = new Stopwatch();
        let success, syncTime, asyncTime, result;
        let thenable = false;
        let type;
        try {
                if (this.async.test(message.content)) code = `(async () => {\n${code}\n})();`;
                result = eval(code)
                syncTime = stopwatch.toString();
                type = new Type(result);
                if (util.isThenable(result)) {
                        thenable = true;
                        stopwatch.restart();
                        result = await result;
                        asyncTime = stopwatch.toString();
                }
                success = true;
        } catch (error) {
            if (!syncTime) syncTime = stopwatch.toString();
            if (!type) type = new Type(error);
            if (thenable && !asyncTime) asyncTime = stopwatch.toString();
            result = error;
            success = false;
        }

        stopwatch.stop();
        if (typeof result !== 'string') {
            result = inspect(result, {
                depth: this.depth
            })
        }
        return { success, type, time: this.formatTime(syncTime, asyncTime), result: util.clean(result) };
    }

    formatTime(syncTime, asyncTime) {
        return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
    }

    codeReplace(code) {
        return code
            .replace(/(-silent|-s)/gi, '')
            .replace(/(-async|-a)/gi, '')
            .replace(/(-message|-m)/gi, '');
    }
}