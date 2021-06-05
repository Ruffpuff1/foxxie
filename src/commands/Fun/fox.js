const axios = require('axios');
const Discord = require('discord.js');
const Command = require('../../../lib/structures/Command');
module.exports = class extends Command {

  constructor(...args) {
      super(...args, {
          name: 'fox',
          aliases: ['ruffy', 'foxy'],
          description: language => language.get('COMMAND_FOX_DESCRIPTION'),
          usage: 'fox fox',
          category: 'fun'
      })
  }

  async run(msg) {

      const loading = await msg.responder.loading();
      const img = await axios.get(`https://randomfox.ca/floof/`).catch(() => null);

      const embed = new Discord.MessageEmbed()
          .setTitle(msg.language.get("COMMAND_FOX_TITLE"))
          .setColor(msg.guild.me.displayColor)
          .setImage(img.data.image)
          .setFooter(msg.language.get("COMMAND_FOX_FOOTER"))
          .setTimestamp()

      msg.channel.send(embed);
      return loading.delete();
  }
}