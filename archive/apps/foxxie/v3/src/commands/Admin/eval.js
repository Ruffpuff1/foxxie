const { Command, util, Stopwatch, Type } = require('@foxxie/tails');
const { inspect } = require('util');

module.exports = class extends Command {
    
    constructor(...args) {
        super(...args, {
            name: 'eval',
            aliases: ['ev'],
            description: language => language.get('COMMAND_EVAL_DESCRIPTION'),
            usage: '(-d=Number) (Code) (-a | -s | -m)',
            permissionLevel: 10,
            runIn: ['text', 'dm'],
            category: 'admin',
        })
    }

    async run(message, code) {
        const depth = /(-depth|-d)=\d/i.test(code[0]) ? parseInt(code[0].slice(2, 3)) : 0;
        code = depth === 0 ? code.slice(0).join(' ') : code.slice(1).join(' ');

        const { success, result, time, type } = await this.eval(message, code, depth);
        const footer = util.codeBlock('ts', type.is);
        let output = message.language.get(success ? 'COMMAND_EVAL_OUTPUT' : 'COMMAND_EVAL_ERROR',
                time, util.codeBlock('js', result.length > 1900 ? result.substring(0, 1900) : result), footer);
        if (/(-silent|-s)/gi.test(message.content)) return null;
        if (/(-message|-m)/gi.test(message.content)) output = result.length > 1900 ? result.substring(0, 1900) : result
        return message.channel.send(output);
    }

    async eval(message, code, depth) {

        const msg = message, client = this.client;
        code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
        code = await this.codeReplace(code);
        const stopwatch = new Stopwatch(0);
        let success, syncTime, asyncTime, result;
        let thenable = false, type;

        try {
                if (/(-async|-a)/gi.test(message.content)) code = `(async () => {\n${code}\n})();`;
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
                depth: depth
            })
        }
        return { success, type, time: this.formatTime(syncTime, asyncTime), result };
    }

    formatTime(syncTime, asyncTime) {
        return asyncTime ? `⏱ ${asyncTime} (${syncTime})` : `⏱ ${syncTime}`;
    }

    codeReplace(code) {
        return code
            .replace(/(-silent|-s)/gi, '')
            .replace(/(-async|-a)/gi, '')
            .replace(/(-message|-m)/gi, '');
    }
}