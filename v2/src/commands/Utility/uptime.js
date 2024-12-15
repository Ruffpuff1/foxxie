module.exports = {
        name: "uptime",
        aliases: ["up", 'stats'],
        usage: "stats",
        category: 'utility',
    execute: async(lang, message, args, client) => {
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;
        message.channel.send(`${lang.COMMAND_UPTIME} **${days}** ${lang.COMMAND_UPTIME_DAYS} **${hours}** ${lang.COMMAND_UPTIME_HOURS} **${minutes}** ${lang.COMMAND_UPTIME_MINUTES} **${seconds}** ${lang.COMMAND_UPTIME_SECONDS}`);
    }
}