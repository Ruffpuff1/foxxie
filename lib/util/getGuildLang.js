const db = require('quick.db')
module.exports.getGuildLang = (message) => {

    let language = db.get(`Guilds.${message.guild.id}.Settings.Language`)
    language ? language = language : language = 'en' 
    let lang = require(`../../src/languages/${language}`)
    return lang;
}