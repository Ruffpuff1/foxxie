import { writeSettings } from '#lib/database';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';

const DATA = [
	{
		aliases: ['jutsu', 'beaver'],
		color: 0,
		content: '**The full name of <@!282321212766552065> is**\n\n{justinName} ',
		delete: false,
		embed: false,
		id: 'justin'
	},
	{
		aliases: [],
		color: 0,
		content: '<a:boop:822179684745084938>',
		delete: false,
		embed: false,
		id: 'strax'
	},
	{
		aliases: [],
		color: 0,
		content: '**Abide by Discord ToS at all times**\n**•** If underage you will be banned :)\n**•** <https://discord.com/guidelines>',
		delete: false,
		embed: false,
		id: 'r1'
	},
	{
		aliases: [],
		color: 0,
		content: '**No spamming of any kind**\n**•** Including random emojis\n**•** Blocks of letters\n**•** Useless ... or anything similar',
		delete: false,
		embed: false,
		id: 'r2'
	},
	{
		aliases: [],
		color: 0,
		content: '**No racism, sexism, or homophobia**\n**•** Will result in an instant mute or ban',
		delete: false,
		embed: false,
		id: 'r3'
	},
	{
		aliases: [],
		color: 0,
		content: '**The Corner Store** was created <t:1601629187:R>',
		delete: false,
		embed: false,
		id: 'howold'
	},
	{
		aliases: [],
		color: 0,
		content:
			"**Foxxie** is a bot made for **The Corner Store**, with advanced moderation, configuration options, utilities, and more! He is currently only used in <@!486396074282450946>'s and his close friend's servers. However if you're interested in what he can do, run `{prefix}help` to see the commands you can use. ",
		delete: false,
		embed: true,
		id: 'foxxie'
	},
	{
		aliases: [],
		color: 0,
		content:
			'`Shortcuts`\n\n> Self roles / Reaction roles [here](https://discord.com/channels/761512748898844702/904072611816939591/904076824018034728)',
		delete: false,
		embed: true,
		id: 'shortcuts'
	},
	{
		aliases: [],
		color: 0,
		content: '<:foxyytired:769734410987634728>',
		delete: false,
		embed: false,
		id: 'amber'
	},
	{
		aliases: [],
		color: 0,
		content:
			'|| 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 || || 🍿 ||',
		delete: false,
		embed: false,
		id: 'pop'
	},
	{
		aliases: [],
		color: 0,
		content:
			'**Permanent Server Invite** <:RuffGiggle:910209648546676816>\nhttps://ruff.cafe/community\n<https://discord.gg/tcs>\nhttps://discord.gg/ZAZ4yRezC7',
		delete: false,
		embed: false,
		id: 'inv'
	},
	{
		aliases: [],
		color: 0,
		content:
			'**Tone Tags**\nTone tags are tone indicators you can use when typing to indicate the tone of a messages, below are some common ones. You can learn more about tone tags [here](https://tonetags.carrd.co).\n\n**•** `/j` - joking\n**•** `/hj` - half joking\n**•** `/s` - sarcastic\n**•** `/srs` - serious\n**•** `/lh` - light hearted\n**•** `/q` - quote\n**•** `/ly` - lyric\n\nIt is important to note that members are not required to use tone tags, nor is it allowed to use them excessively.\nPlease be respectful in your use of language.',
		delete: false,
		embed: true,
		id: 'tone'
	},
	{
		aliases: [],
		color: 0,
		content:
			'`<t:1640412000:D>`        `<t:1640412000:F>`\n<t:1640412000:D>      <t:1640412000:F>\n\n`<t:1640412000:d>`    `<t:1640412000:f>`\n<t:1640412000:d>               <t:1640412000:f>\n\n`<t:1640412000:T>`    `<t:1640412000:R>`\n<t:1640412000:T>            <t:1640412000:R>\n\n`<t:1640412000:t>`\n<t:1640412000:t>',
		delete: false,
		embed: false,
		id: 'unix'
	},
	{
		aliases: [],
		color: 0,
		content: '**You now have great luck for the rest of your life** 💸 🛍️ 💰',
		delete: false,
		embed: false,
		id: 'fortune'
	},
	{
		aliases: [],
		color: 0,
		content: '<:PandaHug:816753976740544543>',
		delete: false,
		embed: false,
		id: 'rain'
	},
	{
		aliases: [],
		color: 0,
		content: '<:PSylveonDerp:816748574099505183>',
		delete: false,
		embed: false,
		id: 'tom'
	},
	{
		aliases: [],
		color: 0,
		content:
			'Official Discord resources:\n• [/report](https://dis.gd/report) reports (harassment/hacking/spam/abuse) and appeals\n• [/support](https://dis.gd/support) anything discord related\n• [/billing](https://dis.gd/billing) payment/nitro\n• [/feedback](https://dis.gd/feedback) feedback/feature requests ',
		delete: false,
		embed: true,
		id: 'disgd'
	},
	{
		aliases: [],
		color: 0,
		content:
			'**Level 1** - <@&775583332292886548>\n**Level 12** - <@&809058881106870282>\n**Level 20** - <@&775587717560008734>\n**Level 35** - <@&775587781296652329>\n**Level 48** - <@&775587805967286302>\n**Level 60** - <@&912228800232816651>\n**Level 90** - <@&938403615448629278> \n\n*Check your level with `fox level`*',
		delete: false,
		embed: false,
		id: 'ranks'
	}
];

export class UserCommand extends FoxxieCommand {
	public async messageRun(message: GuildMessage): Promise<void> {
		await writeSettings(message.guild, { tags: DATA });
	}
}
