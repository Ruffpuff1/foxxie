import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Awaitable, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { Stopwatch } from '@sapphire/stopwatch';
import { getSupportedUserLanguageT, LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { sendMessage } from '#utils/functions';
import { InteractionContextType } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
	aliases: ['pong'],
	description: LanguageKeys.Commands.General.PingDescription,
	runIn: [CommandOptionsRunTypeEnum.Dm, CommandOptionsRunTypeEnum.GuildAny]
})
export default class UserCommand extends FoxxieCommand {
	public override async chatInputRun(interaction: FoxxieCommand.ChatInputCommandInteraction): Promise<void> {
		const t = getSupportedUserLanguageT(interaction);
		const show = interaction.options.getBoolean('show') ?? false;
		const msg = await interaction.reply({ content: t(LanguageKeys.Commands.General.Ping), embeds: undefined, ephemeral: !show });

		const stopwatch = new Stopwatch().start();
		await this.container.prisma.$connect();
		stopwatch.stop();

		const fetched = await msg.fetch();

		const content = t(LanguageKeys.Commands.General.PingPong, {
			dbPing: Math.round(stopwatch.duration),
			roundTrip: fetched.createdTimestamp - interaction.createdTimestamp,
			wsPing: Math.round(this.container.client.ws.ping)
		});

		await msg.edit({ content });
	}

	public async messageRun(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
		const msg = await sendMessage(message, args.t(LanguageKeys.Commands.General.Ping));

		const stopwatch = new Stopwatch().start();
		await this.container.prisma.$connect();
		stopwatch.stop();

		const content = args.t(LanguageKeys.Commands.General.PingPong, {
			dbPing: Math.round(stopwatch.duration),
			roundTrip: (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp),
			wsPing: Math.round(this.container.client.ws.ping)
		});

		await sendMessage(message, content);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry): Awaitable<void> {
		registry.registerChatInputCommand((builder) => builder.setName('ping').setDescription('pong').setContexts(InteractionContextType.Guild), {
			idHints: ['1315209780419366984']
		});
	}
}
