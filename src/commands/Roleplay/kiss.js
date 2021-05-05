const { roleplayCommand } = require('../../../lib/structures/roleplayCommands')
module.exports = {
    name: 'kiss',
    aliases: ['smooch'],
    usage: `fox kiss [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args, lang } = props
        
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
    
        let text = args.slice(1).join(' ');

        let command = 'kiss';
        let actionText = 'is kissing';

        roleplayCommand(message, command, mentionMember, text, actionText)
    }
}