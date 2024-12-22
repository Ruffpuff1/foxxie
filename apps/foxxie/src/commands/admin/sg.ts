import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { createSuggestion } from '#modules/suggestions';
import { Message, userMention } from 'discord.js';

export class UserCommand extends FoxxieCommand {
	public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<void> {
		const str = await args.rest('string');
		await createSuggestion(
			msg as GuildMessage,
			{
				avatar: msg.member!.displayAvatarURL(),
				id: msg.author.id,
				mention: userMention(msg.author.id),
				tag: msg.member!.displayName
			},
			str
		);
	}
}
