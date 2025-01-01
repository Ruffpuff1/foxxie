import makeRequest from '@aero/http';
import { FoxxieCommand } from '#lib/structures';
import { Emojis } from '#utils/constants';
import { GuildOnlyCommand, RegisterSubcommand } from '#utils/decorators';
import { sendMessage } from '#utils/functions';
import { hideLinkEmbed, hyperlink } from 'discord.js';

@GuildOnlyCommand()
@RegisterSubcommand((command) => command.setAliases('short'))
export class ShortenCommand extends FoxxieCommand {
	public async messageRun(...[message, args]: FoxxieCommand.MessageRunArgs) {
		const url = await args.pick('url');
		const slug = (await args.pick('string')).replace(' ', '/').replace('-', '/');

		try {
			const result = await makeRequest('https://rsehrk-i1rl-ruffpuff1s-projects.vercel.app/')
				.path('api', 'url', 'create', slug)
				.query({ url })
				.json();
			console.log(result);

			if (result.message === 'Success') {
				const path = result?.result.path;

				const content = `${Emojis.Success}: ${hyperlink(`rshk.me/${path}`, hideLinkEmbed(`https://rshk.me/${path}`))}`;
				await sendMessage(message, content);
			}
		} catch {
			this.error('fail');
		}
	}
}
