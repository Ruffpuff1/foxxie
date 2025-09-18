import { PermissionLevels } from '#Resources';
import { FoxxieSubcommand, GuildOnlyCommand, MessageSubcommand, RegisterSubcommand } from '#Structures';

import { PlayCommands } from '../PlayCommands.js';

@GuildOnlyCommand()
@RegisterSubcommand({
	aliases: ['fm', 'lfm'],
	name: 'lastfm',
	permissionLevel: PermissionLevels.BotOwner
})
export class LastFMCommand extends FoxxieSubcommand {
	@MessageSubcommand(LastFMCommand.SubcommandKeys.Pace, false, ['pc'])
	public static async MessageRunPace(...[message, args, context]: FoxxieSubcommand.MessageRunArgs) {
		return PlayCommands.Pace(message, args, context);
	}

	public static SubcommandKeys = {
		FM: 'fm',
		Pace: 'pace',
		Profile: 'profile',
		Update: 'update'
	};
}
