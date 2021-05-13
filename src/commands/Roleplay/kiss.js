const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'kiss',
    aliases: ['smooch'],
    usage: `fox kiss [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args, lang } = props
        
        return new RoleplayCommand(message).execute(lang, "kiss", args, false)
    }
}