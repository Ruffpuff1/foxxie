module.exports = {
        name: "uptime",
        aliases: ["up", 'stats'],
        usage: "stats",
        category: 'utility',
    execute: async(props) => {

        let { lang, message, args } = props;
        let days = Math.floor(message.client.uptime / 86400000);
        let hours = Math.floor(message.client.uptime / 3600000) % 24;
        let minutes = Math.floor(message.client.uptime / 60000) % 60;
        let seconds = Math.floor(message.client.uptime / 1000) % 60;
        message.channel.send(`${lang.COMMAND_UPTIME} **${days}** ${lang.COMMAND_UPTIME_DAYS} **${hours}** ${lang.COMMAND_UPTIME_HOURS} **${minutes}** ${lang.COMMAND_UPTIME_MINUTES} **${seconds}** ${lang.COMMAND_UPTIME_SECONDS}`);
    }
}