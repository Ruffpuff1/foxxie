const Discord = require('discord.js');

require('../lib/extensions/Guild');
require('../lib/extensions/Message');
require('../lib/extensions/User');
require('../lib/extensions/GuildMember');

const client = new Discord.Client({ shards: 'auto', partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const { launchEvents } = require('./ws/events/LaunchEvents');
require('dotenv').config();
launchEvents(client);

client.login(process.env.DEV);