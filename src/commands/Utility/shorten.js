var isgd = require('isgd');
module.exports = {
    name: 'shorten',
    aliases: ['sl', 'tiny'],
    usage: 'fox shorten [link] (name)',
    category: 'utility',
    execute: async(props) => {

        let { message, args } = props;
        if (!args[0]) return message.responder.error('COMMAND_SHORTEN_NOARGS');

        if (!args[1]) isgd.shorten(args[0], function(res) {
            message.responder.success();
            return message.responder.success('COMMAND_SHORTEN_SUCCESS', res);
        });

        let name = args[1].replace(/[^a-zA-Z0-9_]\s*/ugi, '_');
    
        isgd.custom(args[0], name, function(res) {
            if (res.startsWith('Error')) return message.responder.error('COMMAND_SHORTEN_ERROR', name);
            message.responder.success();
            message.responder.success('COMMAND_SHORTEN_SUCCESS_NAME', args[1], res);
        });
    }
}