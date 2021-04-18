module.exports.getGuildLang = (message) => {

    let language = 'en'
    language ? language = language : language = 'en' 
    let lang = require(`../../src/languages/${language}`)
    return lang;
}