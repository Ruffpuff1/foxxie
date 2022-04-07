const config = require('../../../lib/config')
module.exports = {
    name: 'eval',
    aliases: ['ev'],
    usage: 'fox eval [code]',
    category: 'developer',
    execute: async (lang, message, args, client) => {

        if (config.devs.includes(message.author.id)) {
            let codein = args.slice(0).join(" ")
            if (!codein.toLowerCase().includes("token")) {
                try {
                    let code = eval(codein)
                    let type = typeof code
                    if (codein.legth < 1 && !codein)
                        return message.channel.send(`${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${COMMAND_EVAL_UNDEFINED}\n\`\`\``)
                    if (typeof code !== "string")
                        code = require("util").inspect(code, { depth : 0 } )

                    message.channel.send(`\n${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${code.length > 1024 ? `${lang.COMMAND_EVAL_OVER}` : code}\n\`\`\`\n${lang.COMMAND_EVAL_TYPE}\n\`\`\`javascript\n${type}\n\`\`\``)
                        .then(resultMessage => {
                            const time = resultMessage.createdTimestamp - message.createdTimestamp
                            const timeMs = resultMessage.createdTimestamp*1000 - message.createdTimestamp*1000
                            resultMessage.edit(`\n${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${code.length > 1024 ? `${lang.COMMAND_EVAL_OVER}` : code}\n\`\`\`\n${lang.COMMAND_EVAL_TYPE}\n\`\`\`javascript\n${type}\n\`\`\`\n:stopwatch: ${time}ms (${timeMs.toLocaleString()}μs)`)
                        }
                    )
                } catch(e) {
                    let eType = typeof e
                    message.channel.send(`\n${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${e.length > 1024 ? `${lang.COMMAND_EVAL_OVER}` : e}\n\`\`\`\n${lang.COMMAND_EVAL_TYPE}\n\`\`\`javascript\n${eType}\n\`\`\``)
                        .then(resultMessage => {
                            const time = resultMessage.createdTimestamp - message.createdTimestamp
                            const timeMs = resultMessage.createdTimestamp*1000 - message.createdTimestamp*1000
                            resultMessage.edit(`\n${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${e.length > 1024 ? `${lang.COMMAND_EVAL_OVER}` : e}\n\`\`\`\n${lang.COMMAND_EVAL_TYPE}\n\`\`\`javascript\n${eType}\n\`\`\`\n:stopwatch: ${time}ms (${timeMs.toLocaleString()}μs)`)
                        }
                    )
                }
            }
                else {
                    message.channel.send(`${lang.COMMAND_EVAL_OUTPUT}\n\`\`\`javascript\n${lang.COMMAND_EVAL_TOKEN}\n\`\`\``)
                }
        }
    }
}
