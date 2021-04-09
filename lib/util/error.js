module.exports.codeError = (lang, message) => {
    message.channel.send(lang.MESSAGE_ERROR_CODE_ERROR)
}

module.exports.permError = (lang, message, command) => {
    message.channel.send(`${lang.MESSAGE_ERROR_PERM_ERROR1} \`${command.permissions}\` ${lang.MESSAGE_ERROR_PERM_ERROR2}`)
}