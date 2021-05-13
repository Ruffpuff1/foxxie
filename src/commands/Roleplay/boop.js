const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'boop',
    aliases: ['noseboop'],
    usage: `fox boop [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args, lang } = props
        
        return new RoleplayCommand(message).execute(lang, "boop", args, false)
    }
}