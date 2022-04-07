module.exports.getGuildLang = () => {

    let language = 'en'
    language ? language = language : language = 'en' 
    let lang = require(`../../src/languages/${language}`)
    return lang;
}