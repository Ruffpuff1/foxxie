import { send } from '@sapphire/plugin-editable-commands';
import { ContextModel } from '#apis/last.fm/util/ContextModel';
import { UserBuilder } from '#apis/last.fm/util/index';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { sendLoadingMessage } from '#utils/functions';

export class UserCommand extends FoxxieCommand {
	public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
		await sendLoadingMessage(msg);
		const lfmUser = await this.container.prisma.userLastFM.findFirst({
			include: { discogs: true, discogsReleases: true },
			where: { userid: msg.author.id }
		});

		const builder = new UserBuilder();
		const context = new ContextModel(
			{
				channel: msg.channel,
				guild: msg.guild!,
				message: msg,
				t: args.t,
				user: msg.author
			},
			args.commandContext.commandPrefix,
			lfmUser
		);

		const response = await builder.profile(context);
		await send(msg, response);
	}
}
