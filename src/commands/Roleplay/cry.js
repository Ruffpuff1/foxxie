const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'cry',
    aliases: ['sob'],
    usage: `fox cry (user) (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("cry", args, true)
    }
}