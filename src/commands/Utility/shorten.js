var isgd = require('isgd');
module.exports = {
    name: 'shorten',
    aliases: ['sl', 'tiny'],
    usage: 'fox shorten [link] (name)',
    category: 'utility',
    execute: async(props) => {

        let { lang, message, args, language } = props;
        if (!args[0]) return language.send('COMMAND_SHORTEN_NOARGS', lang);

        if (!args[1]) isgd.shorten(args[0], function(res) {
            message.responder.success();
            return language.send('COMMAND_SHORTEN_SUCCESS', lang, res);
        });

        let name = args[1].replace(/[^a-zA-Z0-9_]\s*/ugi, '_');
    
        isgd.custom(args[0], name, function(res) {
            if (res.startsWith('Error')) return language.send('COMMAND_SHORTEN_ERROR', lang, name);
            message.responder.success();
            language.send('COMMAND_SHORTEN_SUCCESS_NAME', lang, args[1], res);
        });
    }
}