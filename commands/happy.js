const Discord = require('discord.js');
module.exports = {
    name: 'happy',
    description: 'Roleplay command for happy',
    execute(message, args) {
        const happy= ["https://cdn.discordapp.com/attachments/713916004954275851/713941604171251803/bBjyBBELm-y.gif", "https://cdn.discordapp.com/attachments/713916004954275851/713941631652331531/KurxTAF4lLC.gif", "https://cdn.discordapp.com/attachments/713916004954275851/713941649566204006/jiKEIBTnjD8.gif", "https://cdn.discordapp.com/attachments/713916004954275851/713941660815327252/vzF17VYrPnJ.gif", "https://cdn.discordapp.com/attachments/713916004954275851/713941618515771432/gxf9q_J_cO9.gif"]
        var url = happy[Math.floor(Math.random() * happy.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('2cdbe2')
        embed.setDescription(`**${message.member}** is happy`)
        embed.setImage(url)
        message.channel.send(embed)
    }
    }

