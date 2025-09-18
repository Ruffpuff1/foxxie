import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { Stopwatch } from '@sapphire/stopwatch';
import { Awaitable } from '@sapphire/utilities';

import { LanguageKeys } from '../Resources/Intl/index.js';
import { MessageService } from '../Services/index.js';
import { ChatInputPing } from '../SlashCommands/Ping.js';
import { FoxxieCommand } from '../Structures/index.js';

@ApplyOptions<FoxxieCommand.Options>({
	aliases: ['pong'],
	description: LanguageKeys.Commands.General.Ping.Description,
	fullCategory: ['general'],
	name: 'ping',
	runIn: [CommandOptionsRunTypeEnum.Dm, CommandOptionsRunTypeEnum.GuildAny]
})
export class Ping extends FoxxieCommand {
	public override chatInputRun = ChatInputPing.ChatInputPing;

	public override async messageRun(...[message, args]: FoxxieCommand.MessageRunArgs) {
		const loading = await MessageService.SendMessage(message, args.t(LanguageKeys.Commands.General.Ping.Ping));

		const stopwatch = new Stopwatch().start();
		const loadingTimestamp = loading.editedTimestamp || loading.createdTimestamp;

		await this.container.prisma.guilds.findFirst();
		stopwatch.stop();

		const content = args.t(LanguageKeys.Commands.General.Ping.Pong, {
			dbPing: stopwatch.toString(),
			roundTrip: loadingTimestamp - message.createdTimestamp,
			wsPing: Math.round(loadingTimestamp - message.createdTimestamp)
		});

		await MessageService.SendMessage(message, content);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry): Awaitable<void> {
		ChatInputPing.Register(registry);
	}
}
