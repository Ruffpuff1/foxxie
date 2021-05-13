const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'lurk',
    aliases: ['hide'],
    usage: `fox lurk (user) (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args, lang } = props
        
        return new RoleplayCommand(message).execute(lang, "lurk", args, true)
    }
}