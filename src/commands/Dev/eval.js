const foxxie = require('../../../config/foxxie')
const moment = require('moment')
const { modStatsAdd, getUserMessageCount, getGuildMessageCount } =  require('../../../src/tasks/stats')
const { flags: { async, depth, silent } } = require('../../../lib/util/constants')
const constant = require('../../../lib/util/constants')
const { roleplayCommand } = require('../../../lib/structures/roleplayCommands')
const roleplay = require('../../../lib/structures/roleplayCommand')
const english = require('../../languages/en')
const spanish = require('../../languages/es')
const Discord = require('discord.js')

module.exports = {
    name: 'eval',
    aliases: ['ev'],
    usage: 'fox eval [code] (-async|-a) (-silent|-s)',
    category: 'developer',
    execute: async (lang, msg, args) => {
        let client = msg.client

        let tru = silent.test(msg.content)
        let asyn = async.test(msg.content)
        let codein = args.slice(0).join(" ").replace(silent, '')
        codein = codein.replace(async, '')
        asyn ? codein = `(async () => {\n${codein}\n})();` : ''


        if (foxxie.owner.includes(msg.author.id)) {
            if (!codein.toLowerCase().includes("token")) {
                try {
                    let code = eval(codein)
                    let type = typeof code
                    if (codein.legth < 1 && !codein)
                        return msg.channel.send(`${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${COMMAND_EVAL_UNDEFINED}\n\`\`\``)
                    if (typeof code !== "string")
                        code = require("util").inspect(code, { depth : 0 } )
                    
                    if (!tru) msg.channel.send(`\n${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${code.length > 1024 ? `${lang.COMMAND_EVAL_OVER}` : code}\n\`\`\`\n${lang.COMMAND_EVAL_TYPE}\n\`\`\`javascript\n${type}\n\`\`\``)
                        .then(resultmsg => {
                            const time = resultmsg.createdTimestamp - msg.createdTimestamp
                            const timeMs = resultmsg.createdTimestamp*1000 - msg.createdTimestamp*1000
                            resultmsg.edit(`\n${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${code.length > 1024 ? `${lang.COMMAND_EVAL_OVER}` : code}\n\`\`\`\n${lang.COMMAND_EVAL_TYPE}\n\`\`\`javascript\n${type}\n\`\`\`\n:stopwatch: ${time}ms (${timeMs.toLocaleString()}μs)`)
                        }
                    )
                } catch(e) {
                    let eType = typeof e
                    if (!tru) msg.channel.send(`\n${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${e.length > 1024 ? `${lang.COMMAND_EVAL_OVER}` : e}\n\`\`\`\n${lang.COMMAND_EVAL_TYPE}\n\`\`\`javascript\n${eType}\n\`\`\``)
                        .then(resultmsg => {
                            const time = resultmsg.createdTimestamp - msg.createdTimestamp
                            const timeMs = resultmsg.createdTimestamp*1000 - msg.createdTimestamp*1000
                            resultmsg.edit(`\n${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${e.length > 1024 ? `${lang.COMMAND_EVAL_OVER}` : e}\n\`\`\`\n${lang.COMMAND_EVAL_TYPE}\n\`\`\`javascript\n${eType}\n\`\`\`\n:stopwatch: ${time}ms (${timeMs.toLocaleString()}μs)`) 
                        }
                    )
                }
            }
                else {
                    msg.channel.send(`${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${lang.COMMAND_EVAL_TOKEN}\n\`\`\``)
                }
        }
    }
}