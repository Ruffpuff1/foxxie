/**
 * Co-authored by Ruff <Ruffpuff#0017> (http://ruff.cafe)
 * Co-authored by ravy (https://ravy.pink)
 */
const req = require('@aero/centra');
const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'define',
            aliases: ['def', 'word'],
            description: language => language.get('COMMAND_DEFINE_DESCRIPTION'),
            usage: '[Word]',
            category: 'utility'
        })

        this.baseURL = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';
    }

    async run(msg, [word]) {
        const loading = await msg.responder.loading();
        const res = await req(this.baseURL).path(word).query('key', process.env.WEBSTERAPI).json();

        const definition = res[0];
		if (!definition || !definition.def || !definition.fl || !definition.hwi) {
            msg.responder.error('COMMAND_DEFINE_NOTFOUND');
            return loading.delete();
        }

        msg.channel.send([
            `(${[definition.fl, ...(definition?.lbs || [])].join(', ')}) **${definition.hwi?.hw}** [${definition.hwi?.prs[0]?.mw}]`,
            definition?.def
                .map(def => def?.sseq.flat(1)
                    .map(sseq => sseq[1])
                    .filter(sense => sense.dt)
                    .map(sense => {
                        const output = [];

                        const definitions = sense?.dt.find(t => t[0] === 'text');
                        if (definitions) {
                            const parsed = definitions[1].replace(/{.+?}/g, '');
                            if (parsed.replace(/\W+/g, '').length === 0) return false;
                            output.push(`- ${parsed}`);
                        }
                        return output.join('\n');
                    })
                    .filter(i => !!i)
                    .slice(0, 3)
                    .join('\n')
                ).slice(0, 3).join('\n')
        ].join('\n'));
        
        return loading.delete();
    }
}