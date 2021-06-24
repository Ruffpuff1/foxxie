/**
 * Co-authored by Ruff <Ruffpuff#0017> (http://ruff.cafe)
 * Co-authored by ravy (https://ravy.pink)
 */
require('dotenv').config();
const req = require('@aero/centra');
const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'wolfram',
            aliases: ['wa'],
            description: language => language.get('COMMAND_WOLFRAM_DESCRIPTION'),
            usage: '[...Search] (-graph)',
            category: 'utility'
        })

        this.baseURL = 'http://api.wolframalpha.com/v1';
    }

    async run(msg, [...query]) {
        query = query.join(' ');
        if (!query?.length) return msg.responder.error('COMMAND_WOLFRAM_NOARGS');

        if ([/\bip\b/i, /location/i, /geoip/i, /where am i/i, /penis/i]
			.some(reg => reg.test(query))) return msg.responder.error('COMMAND_WOLFRAM_ERROR');
        
        if (/(-graph|-g)/i.test(msg.content)) return this.graphical(msg, query.replace(/(-graph|-g)/i, ''));
        const loading = await msg.responder.loading();
        
        const { statusCode, text } = await req(this.baseURL)
            .path('result')
            .query('appid', process.env.WOLFRAMAPI)
            .query('i', query)
            .send();

        if (statusCode !== 200) return msg.responder.error('COMMAND_WOLFRAM_ERROR').then(() => loading.delete());
        if (text.length <= 2000) return msg.channel.send(text).then(() => loading.delete());
        else return msg.responder.error('COMMAND_WOLFRAM_LENGTH', `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query).replace(/\s+/, '+')}`).then(() => loading.delete())
    }

    async graphical(msg, query) {
        const loading = await msg.responder.loading();
        const { statusCode, body } = await req(this.baseURL)
            .path('simple')
            .query('appid', process.env.WOLFRAMAPI)
            .query('units', 'metric')
			.query('width', '1200')
			.query('background', '5c5c8a')
			.query('foreground', 'white')
			.query('i', query)
			.send();

        if (statusCode !== 200) return msg.responder.error('COMMAND_WOLFRAM_ERROR').then(() => loading.delete());

        return msg.channel.send({ files: [{ attachment: body, name: 'wolfram.gif' }] }).then(() => loading.delete())
    }
}