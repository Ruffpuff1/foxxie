const api = require('novelcovid')
const Discord = require('discord.js')
module.exports = {
    name: 'corona',
    aliases: ['cv', 'covid'],
    description: 'Get the current statistics of the Covid-19 pandemic. You can enter a country name, or global for statistics of the whole world.',
    usage: 'fox covid [country/global/world]',
    guildOnly: true,
    execute: async (lang, message, args, client) => {
        let arg = args.slice(0).join(" ")

    if(!arg) return message.channel.send(lang.COMMAND_CORONA_NOARGS)

    const argCap = arg.charAt(0).toUpperCase() + arg.slice(1)
    let covid = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`${lang.COMMAND_CORONA_STATS} / ${argCap}`)
            .setFooter(lang.COMMAND_CORONA_FOOTER)
            

    if(arg.toLowerCase() == "world" || arg.toLowerCase() === "global") {
        message.channel.send(lang.COMMAND_MESSAGE_LOADING).then(resultMessage => {
        const stayhome = api.all().then(response => {
        covid.addFields(
                {
                    name: `:microbe: ${lang.COMMAND_CORONA_CASES}`,
                    value: `**${response.cases.toLocaleString()}** (+${response.todayCases.toLocaleString()} ${lang.COMMAND_CORONA_TODAY})
${response.critical?.toLocaleString() ?? 'N/A'} ${lang.COMMAND_CORONA_CRITICAL}
${response.casesPerOneMillion? `${(response.casesPerOneMillion / 10000).toFixed(4)}%` : 'N/A'} ${lang.COMMAND_CORONA_ABSOLUTEINFECTION}`,
                    inline: false
                },
                {
                    name: `:headstone: ${lang.COMMAND_CORONA_DEATHS}`,
                    value: `**${response.deaths?.toLocaleString() ?? 'N/A'}** (+${response.todayDeaths.toLocaleString()} ${lang.COMMAND_CORONA_TODAY})
${response.cases && response.deaths ? `${((response.deaths / response.cases) * 100).toFixed(2)}%` : 'N/A'}% ${lang.COMMAND_CORONA_CASEFATAL}
${response.deathsPerOneMillion ? `${(response.deathsPerOneMillion / 10000).toFixed(4)}%` : 'N/A'}% ${lang.COMMAND_CORONA_ABSOLUTEFATAL}`,
                    inline: false
                
                },
                {
                    name: `:soap: ${lang.COMMAND_CORONA_RECOVERIES}`,
                    value: `**${response.recovered?.toLocaleString() ?? 'N/A'}**
${response.recovered && response.cases ? `${((response.recovered / response.cases) * 100).toFixed(2)}%` : 'N/A'} ${lang.COMMAND_CORONA_CASERECOVERY}`,
                    inline: false
                },
                {
                    name: `:test_tube: ${lang.COMMAND_CORONA_TEST}`,
                    value: `**${response.tests?.toLocaleString() ?? 'N/A'}**
${response.testsPerOneMillion ? `${(response.testsPerOneMillion / 10000).toFixed(4)}%` : 'N/A'} ${lang.COMMAND_CORONA_POPTESTED}`,
                    inline: false
                }
            )
        message.channel.send(covid)
        resultMessage.delete()
        return
        })
        })
    } else{

        try {
        const stayhome2 = api.countries({country:arg}).then(response => {
            message.channel.send(lang.COMMAND_MESSAGE_LOADING).then(resultMessage => {
            if (response.cases === undefined) return message.channel.send(lang.COMMAND_CORONA_NOSTATS)    
        covid.addFields(
            {
                name: `:microbe: ${lang.COMMAND_CORONA_CASES}`,
                value: `**${response.cases.toLocaleString()}** (+${response.todayCases.toLocaleString()} ${lang.COMMAND_CORONA_TODAY})
${response.critical?.toLocaleString() ?? 'N/A'} ${lang.COMMAND_CORONA_CRITICAL}
${response.casesPerOneMillion? `${(response.casesPerOneMillion / 10000).toFixed(4)}%` : 'N/A'} ${lang.COMMAND_CORONA_ABSOLUTEINFECTION}`,
                inline: false
            },
            {
                name: `:headstone: ${lang.COMMAND_CORONA_DEATHS}`,
                value: `**${response.deaths?.toLocaleString() ?? 'N/A'}** (+${response.todayDeaths.toLocaleString()} ${lang.COMMAND_CORONA_TODAY})
${response.cases && response.deaths ? `${((response.deaths / response.cases) * 100).toFixed(2)}%` : 'N/A'}% ${lang.COMMAND_CORONA_CASEFATAL}
${response.deathsPerOneMillion ? `${(response.deathsPerOneMillion / 10000).toFixed(4)}%` : 'N/A'}% ${lang.COMMAND_CORONA_ABSOLUTEFATAL}`,
                inline: false
            
            },
            {
                name: `:soap: ${lang.COMMAND_CORONA_RECOVERIES}`,
                value: `**${response.recovered?.toLocaleString() ?? 'N/A'}**
${response.recovered && response.cases ? `${((response.recovered / response.cases) * 100).toFixed(2)}%` : 'N/A'} ${lang.COMMAND_CORONA_CASERECOVERY}`,
                inline: false
            },
            {
                name: `:test_tube: ${lang.COMMAND_CORONA_TEST}`,
                value: `**${response.tests?.toLocaleString() ?? 'N/A'}**
${response.testsPerOneMillion ? `${(response.testsPerOneMillion / 10000).toFixed(4)}%` : 'N/A'} ${lang.COMMAND_CORONA_POPTESTED}`,
                inline: false
            }
        )
        message.channel.send(covid)
        resultMessage.delete()
        })
        })
    }catch(e){
message.channel.send(e)
    }

    }
}}