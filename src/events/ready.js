const reminder = require('../tasks/reminder')
const config = require('../../lib/config');
const moment = require('moment')
const tz = require('moment-timezone')
const fs = require('fs')
const afkcheck = require('../tasks/afkcheck')
const Discord = require('discord.js')
const membercount = require('../tasks/membercount')
const disboardBumpSchema = require('../../lib/structures/database/schemas/server/disboard/disboardBumpSchema')
const mongo = require('../../lib/structures/database/mongo')
const disboardMessageSchema = require('../../lib/structures/database/schemas/server/disboard/disboardMessageSchema')
module.exports = {
	name: 'ready',
	once: true,
	execute: async (client) => {
		// logs "ready"
		console.log(`Ready! Logged in as ${client.user.tag}`);
       
		// activities

		const actvs = [
			`v${config.botVer} | .help`,
			`${config.numOfCommands} Commands & ${config.numOfAliases} Aliases`,
			`v${config.botVer} | .invite`,
			`v${config.botVer} | .support`,
			`with ${client.guilds.cache.size} servers & ${client.users.cache.size} users.`];
	
		console.log(`Activities set in ${client.guilds.cache.size} server${client.guilds.cache.size > 1 ? 's' : ''}.`)
	
		client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length))]);
		setInterval(() => {
			client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length))]);
		}, 20000);

        const connectToMongoDB = async () => {
            await mongo().then(mongoose => {
                try {
                    console.log(`Connected to MongoDB`)
                } finally {}
            })
        }
        
        connectToMongoDB()

        reminder(client)
        membercount(client)
        afkcheck(client)


		client.disboard = require('../store/disboard.json')
    client.setInterval(async () => {
        for(let i in client.disboard) {
            let guildID = client.disboard[i].guild
            let authID = client.disboard[i].authID
            let disbordTime = client.disboard[i].time
            let guild = client.guilds.cache.get(guildID)
            let member = guild.members.cache.get(authID)
            let channelID = client.disboard[i].channelID
            let channel = guild.channels.cache.get(channelID)
            let color = client.disboard[i].displayColor
            let deleteTime = client.disboard[i].deleteDbTime

            if(Date.now() > deleteTime) {
                await mongo().then(async (mongoose) => {
                    try {
                        await disboardBumpSchema.findByIdAndDelete({
                            _id: guildID,
                        })
						
                    } finally {}
                })
            }

			if (disbordTime === null) return
    
    if (Date.now() > disbordTime) {

        await mongo().then(async (mongoose) => {
            try {

                let disboardMsg = await disboardMessageSchema.findById({
                    _id: guildID
                })

				console.log('got msg')
    
        const remindEmbedDisboard = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle('Reminder to Bump')
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription("Time to bump the server on disboard. Use the command `!d bump` then come back in **two hours**.")
        //.setTimestamp()
        //.setFooter(guild.name, guild.iconURL( { dynamic: true } ))
// checks for embed description 

        if (disboardMsg !== null) remindEmbedDisboard.setDescription(disboardMsg.disboardMessage)

    
    // checks if guild is the corner store
    if (guildID === '761512748898844702') {
        delete client.disboard[i]
        fs.writeFile('src/store/disboard.json', JSON.stringify(client.disboard, null, 4), err => {
            if (err) throw err; 
        })
		if (channel === undefined) return
		channel.send('**Heya <@&774339676487548969> it\'s time to bump the server.**', {embed: remindEmbedDisboard})
        return
    }
    // for if guild not corner store

    let roleID;
    if (disboardMsg !== null) roleID = disboardMsg.disboardPing

    let dbPing;
    dbPing = ''
    if (roleID !== '' && roleID !== undefined) dbPing = `<@&${roleID}>`


	delete client.disboard[i]
    console.log('deleted client.disboard')
    fs.writeFile('src/store/disboard.json', JSON.stringify(client.disboard, null, 4), err => {
        if (err) throw err; 
    })
	if (channel === undefined) return
    channel.send(dbPing, {embed: remindEmbedDisboard})
	console.log('sent reminder')
    
} finally {}
    })

    }

    
        }
    }, 1000)


		const timeNow = moment().tz(config.timezone).format(config.format);
		const clockChannel = client.channels.cache.get(config.clockchannel);

  		if (clockChannel === undefined) return

  		clockChannel.edit({ name: `🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${timeNow}` }, 'Clock update')
  		.catch(console.error);

  		setInterval(() => {
  			const timeNowUpdate = moment().tz(config.timezone).format(config.format);
  			clockChannel.edit({ name: `🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${timeNowUpdate}` }, 'Clock update')
  			.catch(console.error);

			console.log(`set the time to ${timeNowUpdate}`)
  		}, config.updateinterval);
	},
};