const { ShardingManager } = require('discord.js');
const config = require('./lib/config')
const manager = new ShardingManager('src/bot.js', { token: config.token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();

manager.on('message', (shard, message) => {
	console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});