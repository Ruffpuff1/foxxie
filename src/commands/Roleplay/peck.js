const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'peck',
    aliases: ['butterfly-kiss'],
    usage: `fox peck [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args, lang } = props
        
        return new RoleplayCommand(message).execute(lang, "peck", args, false)
    }
}