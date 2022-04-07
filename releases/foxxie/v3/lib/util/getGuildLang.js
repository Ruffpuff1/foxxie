module.exports.getGuildLang = () => {

    let language = 'en'
    let lang = require(`../../src/languages/${language}`)
    return lang;
}
