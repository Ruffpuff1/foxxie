const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'hug',
    aliases: ['facefuck'],
    usage: `fox hug [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("hug", args, false)
    }
}