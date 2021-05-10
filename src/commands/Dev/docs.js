const { MessageEmbed } = require('discord.js')
const Doc = require('discord.js-docs')

module.exports = {
    name: 'docs',
    usage: 'fox docs [search]',
    execute: async (props) => {
        
        let { message, args, lang, language } = props

        const doc = await Doc.fetch('stable')
        let search = doc.search(args[0])[0]

        if (search == null) return message.channel.send('null')

        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setDescription(`__**[${search.name}](${search.url})**__ ${search.extends ? `(extends **${search.extends[0][0][0]}**)` : ''}
${search.description.replace(/\<\/?(info|warn)\>/gi, "**")}`)

        if (search.props) embed.addField('**Properties**', search.props.map(p => `\`${p.name}\``).join(" "))
        if (search.methods) embed.addField('**Methods**', search.methods.map(m => `\`${m.name}\``).join(" "))
        if (search.events) embed.addField('**Events**', search.events.map(e => `\`${e.name}\``).join(" "))
        if (search.returns) embed.addField('**Returns**', `**${search.returns[0] ? search.returns[0][0][0] : search.returns}**`)
        if (search.examples) embed.addField('**Examples**', search.examples.map(e => `\`\`\`js\n${e}\n\`\`\``).join('\n'))

        message.channel.send(embed)
    }
}