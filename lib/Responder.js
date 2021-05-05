module.exports.mimuPick = (message, lang) => message.channel.send(message.guild.language.get('RESPONDER_TCS_MIMU_PICK', 'en-US'))
module.exports.clientPerms = (message, permission) => message.channel.send(message.guild.language.get('RESPONDER_ERROR_PERMS_CLIENT', 'en-US', [permission]))
module.exports.authorPerms = (message, lang, command) => message.channel.send(message.guild.language.get('RESPONDER_ERROR_PERMS_AUTHOR', 'en-US', [command.permissions]))
module.exports.code = (message, lang) => message.channel.send(message.guild.language.get('RESPONDER_ERROR_CODE', 'en-US'))
module.exports.foxFact = (message, lang) => message.channel.send(message.guild.language.get('RESPONDER_ERROR_FOXFACT', 'en-US'))

module.exports.channel = (message, lang) => {
    message.delete();
    message.channel.send(message.guild.language.get('RESPONDER_FOXXIE_CUBBY_WRONG_CHANNEL', 'en-US', [message]))
    .then(msg => { setTimeout(() => msg.delete(), 10000) })
}