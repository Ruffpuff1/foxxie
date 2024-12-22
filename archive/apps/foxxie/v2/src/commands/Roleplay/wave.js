const { roleplayCommand } = require('../../../lib/structures/roleplayCommands')
module.exports = {
    name: 'wave',
    aliases: ['hello', 'greet', 'bye', 'goodbye', 'hi', 'hey'],
    usage: `fox tease [user] (reason)`,
    category: 'roleplay',
    execute(lang, message, args) {
        
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
    
        let text = args.slice(1).join(' ');

        let command = 'wave';
        let actionText = 'is waving at';

        roleplayCommand(message, command, mentionMember, text, actionText)
    }
}