const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'kill',
    aliases: ['murder', 'destroy'],
    usage: `fox kill [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("kill", args, false)
    }
}