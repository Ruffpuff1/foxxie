const Foxxie = require('../lib/Foxxie');
require('../lib/extensions/Guild');
require('../lib/extensions/Message');
require('../lib/extensions/User');
require('../lib/extensions/GuildMember');
require('../lib/extensions/TextChannel');

const client = new Foxxie({ shards: 'auto', partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
require('dotenv').config();

client.login(process.env.DEV);