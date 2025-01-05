import { RequiresClientPermissions } from '@sapphire/decorators';
import { ContextModel } from '#apis/last.fm/index';
import { FoxxieCommand } from '#lib/structures';
import { LastFMCommand } from '#root/commands/websearch/lastfm';
import { RequiresMemberPermissions } from '#utils/decorators';
import { sendLoadingMessage, sendMessage } from '#utils/functions';
import { resolveYouOrFoxxie } from '#utils/resolvers';
import { PermissionFlagsBits } from 'discord.js';

import { LastFMUserBuilder } from '../utils/builders/LastFMUserBuilder.js';

export class UserCommands {
	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async Profile(...[message, args]: FoxxieCommand.MessageRunArgs) {
		await sendLoadingMessage(message);
		const contextUser = await args.pick(LastFMCommand.UserArgument).catch(() => resolveYouOrFoxxie(message));

		const response = await LastFMUserBuilder.Profile(new ContextModel(args, contextUser));
		await sendMessage(message, response);
	}
}
