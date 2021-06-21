const Foxxie = require('../lib/Foxxie');
const options = require('../config/foxxie')
require('../lib/extensions/Guild');
require('../lib/extensions/Message');
require('../lib/extensions/Role');
require('../lib/extensions/User');
require('../lib/extensions/GuildMember');
require('../lib/extensions/TextChannel');

const client = new Foxxie(options);
require('dotenv').config();

client.login(process.env.DEV);