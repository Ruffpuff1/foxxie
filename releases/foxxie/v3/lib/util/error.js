module.exports.codeError = (lang, message) => {
    message.channel.send(lang.MESSAGE_ERROR_CODE_ERROR)
}

module.exports.permError = (lang, message, command) => {
    message.channel.send(`${lang.MESSAGE_ERROR_PERM_ERROR1} \`${command.permissions}\` ${lang.MESSAGE_ERROR_PERM_ERROR2}`)
}

module.exports.botPermError = (lang, message, permission) => {
    message.channel.send(`I don't have the correct permissions to run this command! I need the \`${permission}\` permission in this channel. As an alternative you can give my role the \`ADMINISTRATOR\` permission to bypass this issue.`)
}

module.exports.channelError = (lang, message) => {
    message.delete();
    message.channel.send(`${message.member}, this channel **isnt** meant to test out my commands. For that, you should head over to <#825896913810358274>.`)
    .then(msg => { setTimeout(() => msg.delete(), 10000) })
}