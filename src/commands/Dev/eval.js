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
    usage: 'fox eval [code] (-async|-a) (-silent|-s) (-message|-m)',
    category: 'developer',
    execute: async (props) => {

        let { message, args, lang, language } = props

        let client = message.client

        let tru = silent.test(message.content)
        let asyn = async.test(message.content)
        let msg = /\-message\s*|-m\s*/gi
        let truMsg = msg.test(message.content)
        let codein = args.slice(0).join(" ").replace(silent, '')
        codein = codein.replace(async, '')
        codein = codein.replace(msg, '')
        asyn ? codein = `(async () => {\n${codein}\n})();` : ''


        if (foxxie.owner.includes(message.author.id)) {
            if (!codein.toLowerCase().includes("token")) {
                try {
                    let code = eval(codein)
                    let type = typeof code
                    if (codein.legth < 1 && !codein)
                        return message.channel.send(`${language.get('COMMAND_EVAL_OUTPUT', lang)}\n\`\`\`javascript\n${language.get('COMMAND_EVAL_UNDEFINED', lang)}\n\`\`\``)
                    if (typeof code !== "string")
                        code = require("util").inspect(code, { depth : 0 } )
                    
                    if (!tru && !truMsg) message.channel.send(`\n${language.get('COMMAND_EVAL_OUTPUT', lang)}\n\`\`\`javascript\n${code.length > 1024 ? `${language.get('COMMAND_EVAL_OVER', lang)}` : code}\n\`\`\`\n${language.get('COMMAND_EVAL_TYPE', lang)}\n\`\`\`javascript\n${type}\n\`\`\``)
                        .then(resultmessage => {
                            const time = resultmessage.createdTimestamp - message.createdTimestamp
                            const timeMs = resultmessage.createdTimestamp*1000 - message.createdTimestamp*1000
                            resultmessage.edit(`\n${language.get('COMMAND_EVAL_OUTPUT', lang)}\n\`\`\`javascript\n${code.length > 1024 ? `${language.get('COMMAND_EVAL_OVER', lang)}` : code}\n\`\`\`\n${language.get('COMMAND_EVAL_TYPE', lang)}\n\`\`\`javascript\n${type}\n\`\`\`\n:stopwatch: ${time}ms (${timeMs.toLocaleString()}μs)`)
                        }
                    )
                    if (truMsg) message.channel.send('output: ' + code.length > 1024 ? `${language.get('COMMAND_EVAL_OVER', lang)}` : code)
                } catch(e) {
                    let eType = typeof e
                    message.channel.send(`\n${language.get('COMMAND_EVAL_OUTPUT', lang)}\n\`\`\`javascript\n${e.length > 1024 ? `${language.get('COMMAND_EVAL_OVER', lang)}` : e}\n\`\`\`\n${language.get('COMMAND_EVAL_TYPE', lang)}\n\`\`\`javascript\n${eType}\n\`\`\``)
                        .then(resultmessage => {
                            const time = resultmessage.createdTimestamp - message.createdTimestamp
                            const timeMs = resultmessage.createdTimestamp*1000 - message.createdTimestamp*1000
                            resultmessage.edit(`\n${language.get('COMMAND_EVAL_OUTPUT', lang)}\n\`\`\`javascript\n${e.length > 1024 ? `${language.get('COMMAND_EVAL_OVER', lang)}` : e}\n\`\`\`\n${language.get('COMMAND_EVAL_TYPE', lang)}\n\`\`\`javascript\n${eType}\n\`\`\`\n:stopwatch: ${time}ms (${timeMs.toLocaleString()}μs)`) 
                        }
                    )
                }
            }
                else {
                    message.channel.send(`${language.get('COMMAND_EVAL_OUTPUT', lang)}\n\`\`\`javascript\n${language.get('COMMAND_EVAL_TOKEN', lang)}\n\`\`\``)
                }
        }
    }
}