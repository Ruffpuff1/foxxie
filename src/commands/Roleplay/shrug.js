const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'shrug',
    aliases: ['whatever', 'whateves', 'shrugs'],
    usage: `fox shrug (user) (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args, lang } = props
        
        return new RoleplayCommand(message).execute(lang, "shrug", args, true)
    }
}