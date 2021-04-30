const { status } = require("./status");

module.exports = {
	name: 'ready',
	once: true,
	execute(bot) {
		console.log(`${bot.user.tag} is online.`)
        bot.user.setPresence({
            status: "online",
            activity: {
                name: `with ${bot.guilds.cache.size} servers | pouncing and playing with ${bot.users.cache.size} users | sticking my head in the snow to find 60 commands.`,
                type: "PLAYING"
            }
        });

        status(bot)
        .catch()
        setInterval(() => {
            status(bot)
        }, 15000)

	},
};