const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'dab',
    aliases: ['epic'],
    usage: `fox dab (user) (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("dab", args, true)
    }
}