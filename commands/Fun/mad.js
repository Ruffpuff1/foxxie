const Discord = require('discord.js');
module.exports = {
    name: 'mad',
    description: 'Lets you be mad at someone.',
    execute(message, args) {
        var user = message.mentions.users.first();
        const mad= ["https://media1.tenor.com/images/2e915cd96500daf6349a2f4a75a4e8de/tenor.gif?itemid=8409151",   "https://media1.tenor.com/images/e56e1ae197ea11668756e6e82407e5c5/tenor.gif?itemid=12679335",    "https://media1.tenor.com/images/f8ce8a3d9e831a3136aafec10f40e3ce/tenor.gif?itemid=9161940",   "https://media1.tenor.com/images/abd80931f9bf97dd7e039cc72e26285f/tenor.gif?itemid=10069688",    "https://media1.tenor.com/images/52c4d55c27725df1b0a35178ad7cbc08/tenor.gif?itemid=10166732",    "https://media1.tenor.com/images/dc65e65a4cbec62e5316f415cc009096/tenor.gif?itemid=20564182",    "https://media1.tenor.com/images/c084c8e385db9e21b51559029867b124/tenor.gif?itemid=20564186",    "https://media1.tenor.com/images/764bcd04b6b35764acf5067c28ef26b6/tenor.gif?itemid=20564194",    "https://media1.tenor.com/images/a2f03b58f6535ac0078027b91f0a9376/tenor.gif?itemid=20564212",    "https://media1.tenor.com/images/99cb5bdb59b5f2deaf7efeeb8ce45f2e/tenor.gif?itemid=20564216",    "https://media1.tenor.com/images/83d3206895a105f1733c7a220cf1fc1f/tenor.gif?itemid=14725928"]
        var url = mad[Math.floor(Math.random() * mad.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('2cdbe2')
        embed.setDescription(`**${message.member}** is made at ${user}`)
        embed.setImage(url)
        message.channel.send(embed)
    }
}