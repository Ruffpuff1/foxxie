var isgd = require('isgd');
module.exports = {
    name: 'shorten',
    aliases: ['sl', 'tiny'],
    usage: 'fox shorten [link] (name)',
    category: 'utility',
    execute: async(props) => {

        let { lang, message, args } = props;
        if (!args[0]) return message.channel.send(`**Please,** specify a **link** you would like to be shortened.`)

        if (args[0] && !args[1]) {

            isgd.shorten(args[0], function(res) {
                message.responder.success();
                message.channel.send(`Here is you're new **shortened** url (<${res}>).`)
            })
        }
        if (args[1]) {

            let name = args[1]

            let reg = /[^a-zA-Z0-9_]\s*/ugi;
            if (reg.test(name)) name = name.replace(reg, '_')

            isgd.custom(args[0], name, function(res) {
                if (res.startsWith('Error')) return message.channel.send(`The provided name **${name}** is already in use at the domain "is.gd".`)
                message.responder.success();
                message.channel.send(`Here is you're new **shortened** url with the name **${args[1]}** (<${res}>).`)
            });
        }
    }
}