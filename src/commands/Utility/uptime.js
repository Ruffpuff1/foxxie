module.exports = {
    name: "uptime",
    aliases: ["up", 'stats'],
    usage: "fox uptime",
    category: 'utility',
    execute: async(props) => {

        let { lang, message, language } = props;
        let days = Math.floor(message.client.uptime / 86400000);
        let hours = Math.floor(message.client.uptime / 3600000) % 24;
        let minutes = Math.floor(message.client.uptime / 60000) % 60;
        let seconds = Math.floor(message.client.uptime / 1000) % 60;

        language.send('COMMAND_UPTIME', lang, days, hours, minutes, seconds);
    }
}