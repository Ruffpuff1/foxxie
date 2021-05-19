const Discord = require('discord.js');

require('../lib/extensions/Guild');
require('../lib/extensions/Message');
require('../lib/extensions/User');

const client = new Discord.Client({ shards: 'auto', partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const { launchEvents } = require('./handlers/LauchEvents');
require('dotenv').config();
launchEvents(client)

client.login(process.env.DEV);