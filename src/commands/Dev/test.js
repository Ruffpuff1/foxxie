const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'test',
    execute(props){

      let { message, args } = props

      const embed = new MessageEmbed()
        .setTitle(`:star: A new message made it into the starboard :star:`)
        .setDescription(`A message by <@486396074282450946> got starred enough to make it into the <#825896161704542279> channel.\nCheck it out [here](https://discord.com/channels/825853736768372746/825896161704542279/827814917838733322)`)
        .setColor(message.guild.me.displayColor)
        .setThumbnail(message.author.displayAvatarURL({dynamic:true}))

      message.channel.send(embed)

        // message.channel.send({embed: {
        //     "title": "Eli's Commands!",
        //     "color": 10181046,
        //     "thumbnail": "https://cdn.discordapp.com/avatars/649604306596528138/3daa7cbef4215c102195e622c584f5ec.png?size=1024",
        //     "fields": [
        //       {
        //         "name": "**Automation (22)**",
        //         "value": "`autoroles`, `boostchannel`, `boostmessage`, `disboardchannel`, `disboardmessage`, `goodbyechannel`, `goodbyeimages`, `goodbyemessage`, `goodbyetimeout`, `loggoodbyechannel`, `logwelcomechannel`, `roledelay`, `stats`, `testboost`, `testdisboard`, `testjoin`, `testleave`, `welcomechannel`, `welcomeimages`, `welcomemessage`, `welcomeping`, `welcometimeout`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Giveaways (10)**",
        //         "value": "`create-giveaway`, `end-giveaway`, `fixduration-giveaaway`, `fixprize-giveaway`, `manage-giveaway`, `reroll-giveaway`, `show-giveaway`, `giveaway`, `giveawayrole`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Leveling (19)**",
        //         "value": "`addlevel`, `blacklistlevel`, `givexp`, `leaderboard`, `levellocation`, `levelmessage`, `levelnotifications`, `levelrole`, `levelstyle`, `leveltype`, `leveluptimeout`, `noxpchannel`, `rank`, `resetlevels`, `setlevel`, `testlevelup`, `whitelistlevel`, `xpchannel`, `xpgain`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Memes (13)**",
        //         "value": "`animeme`, `banreddit`, `cursed`, `history`, `joke`, `meme`, `necro`, `popular`, `programmerhumor`, `reddit`, `showerthoughts`, `til`, `unbanreddit`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Moderation (22)**",
        //         "value": "`adminrole`, `ban`, `jail`, `kick`, `logchannel`, `modrole`, `mute`, `nuke`, `punishments`, `punishmessage`, `purge`, `slowmode`, `srmodrole`, `stafflog`, `unban`, `unjail`, `unmute`, `warn`, `warnings`, `warningtimeout`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Profile (3)**",
        //         "value": "`bio`, `profile`, `rep`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Reaction-Roles (14)**",
        //         "value": "`addreaction`, `create-rr`, `link-rr`, `manage-rr`, `remove-reaction`, `setcolor-rr`, `setdesc-rr`, `settitle-rr`, `settype-rr`, `show-rr`, `unlink-rr`, `reactionrole`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Reminders (10)**",
        //         "value": "`cancel-reminder`, `create-reminder`, `manage-reminder`, `setchannel-reminder`, `setdesc-reminder`, `setinterval-reminder`, `settime-reminder`, `show-reminder`, `reminder`, `remindme`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Roleplay (6)**",
        //         "value": "`block`, `blockcommand`, `counters`, `resetcounters`, `unblock`, `unblockcommand`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Search (11)**",
        //         "value": "`album`, `anime`, `artist`, `define`, `manga`, `playlist`, `pokemon`, `song`, `temtem`, `tenor`, `youtube`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Starboard (8)**",
        //         "value": "`nostarchannels`, `starablechannel`, `starboardchannel`, `starboardemoji`, `starboardminimum`, `starboardnotifications`, `starboardself`, `startop`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Stats / Info (10)**",
        //         "value": "`about`, `avatar`, `channel`, `clusters`, `emoji`, `ping`, `role`, `server`, `uptime`, `user`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Settings (14)**",
        //         "value": "`blacklist`, `botchannel`, `cooldown`, `disable`, `disablesection`, `enable`, `enablesection`, `ignore`, `listen`, `prefix`, `settings`, `superlogchannel`, `verbosity`, `whitelist`",
        //         "inline": false
        //       },
        //       {
        //         "name": "**Utility (18)**",
        //         "value": "`broadcast`, `color`, `embed`, `help`, `invite`, `premium`, `support`, `vote`, `votereminders`, `website`",
        //         "inline": false
        //       }
        //     ]
        //   }})
    }
}