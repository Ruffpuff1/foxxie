const req = require('@aero/centra');
const Discord = require('discord.js');
const { Command } = require('foxxie');

module.exports = class extends Command {

  constructor(...args) {
      super(...args, {
          name: 'fox',
          aliases: ['ruffy', 'foxy'],
          description: language => language.get('COMMAND_FOX_DESCRIPTION'),
          category: 'fun'
      })
  }

  async run(msg) {

      const loading = await msg.responder.loading();
      const { image } = await req(`https://randomfox.ca/floof/`)
            .header('Accept', 'application/json')
            .json()
            .catch(() => null);

      const embed = new Discord.MessageEmbed()
          .setTitle(msg.language.get("COMMAND_FOX_TITLE"))
          .setColor(msg.guild.me.displayColor)
          .setImage(image)
          .setFooter(msg.language.get("COMMAND_FOX_FOOTER"))
          .setTimestamp()

      msg.channel.send(embed);
      return loading.delete();
  }
}