const foxxie = require('../../../config/foxxie');
const { performance } = require('perf_hooks');
const { flags: { async, depth, silent } } = require('../../../lib/util/constants');

module.exports = {
    name: 'eval',
    aliases: ['ev'],
    usage: 'fox eval [code] (-async|-a) (-silent|-s) (-message|-m)',
    category: 'developer',
    execute: async (props) => {

        let { message, args, lang, language } = props

        let client = message.client;
        if (!foxxie.owner.includes(message.author.id)) return;
        const start = performance.now().toFixed(2);
        let arg = args.slice(0).join(" ");
        let silent = /(-silent|-s)/gi.test(arg);
        let async = /(-async|-a)/gi.test(arg);
        let msg = /(-message|-m)/gi.test(arg);

        function codeReplace() {
            return arg
                .replace(/(-silent|-s)/gi, '')
                .replace(/(-async|-a)/gi, '')
                .replace(/(-message|-m)/gi, '');
        };

        try {

            let code = await codeReplace();
            if (async) code = `(async () => {\n${code}\n})();`;
            let result = eval(code);
            let type = typeof result;

            if (result.length < 1 && result) return message.channel.send(`${language.get('COMMAND_EVAL_OUTPUT', lang)}\n\`\`\`javascript\n${language.get('COMMAND_EVAL_UNDEFINED', lang)}\n\`\`\``);
            if (typeof result !== "string") result = require("util").inspect(result, { depth : 0 } );
            const end = performance.now().toFixed(2);
            let time = (end*1000) - (start*1000);

            if (!msg && !silent) message.channel.send(`\n${language.get('COMMAND_EVAL_OUTPUT', lang)}\n\`\`\`javascript\n${result.length > 1024 ? `${language.get('COMMAND_EVAL_OVER', lang)}` : result}\n\`\`\`\n${language.get('COMMAND_EVAL_TYPE', lang)}\n\`\`\`javascript\n${type}\n\`\`\`\n:stopwatch: ${Math.floor(time)}μs`);
            if (msg) message.channel.send('output: ' + result.length > 1024 ? `${language.get('COMMAND_EVAL_OVER', lang)}` : result);
        } catch(e) {

            let err = typeof e;
            const end = performance.now().toFixed(2);
            let time = (end*1000) - (start*1000);
            message.channel.send(`\n${language.get('COMMAND_EVAL_OUTPUT', lang)}\n\`\`\`javascript\n${e.length > 1024 ? `${language.get('COMMAND_EVAL_OVER', lang)}` : e}\n\`\`\`\n${language.get('COMMAND_EVAL_TYPE', lang)}\n\`\`\`javascript\n${err}\n\`\`\`\n:stopwatch: ${Math.floor(time)}μs`)
        }
    }
}