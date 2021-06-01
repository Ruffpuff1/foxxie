const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'bonk',
    aliases: ['bop'],
    usage: `fox bonk [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("bonk", args, false)
    }
}