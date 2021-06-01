const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'sip',
    aliases: ['tea'],
    usage: `fox sip [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("sip", args, true)
    }
}