const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'sleep',
    aliases: ['sleepy', 'tired'],
    usage: `fox sleep (user) (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("sleep", args, true)
    }
}