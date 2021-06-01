const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'pat',
    aliases: ['headpat'],
    usage: `fox pat [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("pat", args, false)
    }
}