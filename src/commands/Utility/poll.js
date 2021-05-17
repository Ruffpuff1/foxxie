const { poll } = require('../../../lib/util/constants')
const Discord = require('discord.js')
module.exports = {
    name: 'poll',
    usage: 'fox poll [option1], [option2]',
    //category: 'utility',
    execute(props) {

        let { lang, message, args } = props;
        let opt = args.join(" ").toString().split(/\,\s*/)
        let filtered = opt.filter(function (el) {
            return el != null && el != "";
        })
        if (filtered.length > 10) 
            return message.channel.send(lang.COMMAND_POLL_TOO_MANY_OPTIONS)

        if (filtered.length < 2)
            return message.channel.send(lang.COMMAND_POLL_TOO_FEW_OPTIONS)

        this.numbers = poll

        const embed = new Discord.MessageEmbed()
            .setTitle(`${lang.COMMAND_POLL_POLL_BY} ${message.member.user.tag}`)
            .setColor(message.guild.me.displayColor)
            .setDescription(filtered.map((option, idx) => `${idx + 1}. ${option.replace(/,/g, ' ')}`).join('\n'))
            .setFooter(lang.COMMAND_POLL_EMBED_FOOTER)

        message.channel.send(embed).then(async message => {
            for (let i = 0; i < filtered.length; i++) {
                await message.react(this.numbers[i + 1]);
            }
        })
    }
}