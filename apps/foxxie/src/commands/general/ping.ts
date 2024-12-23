import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';
import { Stopwatch } from '@sapphire/stopwatch';
import { getSupportedUserLanguageT, LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { RegisterCommand } from '#utils/decorators';
import { sendMessage } from '#utils/functions';

@RegisterCommand(
	{
		aliases: ['pong'],
		description: PingCommand.Language.Description,
		runIn: [CommandOptionsRunTypeEnum.Dm, CommandOptionsRunTypeEnum.GuildAny]
	},
	(builder) => applyLocalizedBuilder(builder, PingCommand.Language.Name, PingCommand.Language.Description),
	PingCommand.IdHints
)
export default class PingCommand extends FoxxieCommand {
	public override async chatInputRun(interaction: FoxxieCommand.ChatInputCommandInteraction): Promise<void> {
		const t = getSupportedUserLanguageT(interaction);
		const show = interaction.options.getBoolean('show') ?? false;
		const msg = await interaction.reply({ content: t(PingCommand.Language.Ping), embeds: [], ephemeral: !show });

		const stopwatch = new Stopwatch().start();
		await this.container.prisma.$connect();
		stopwatch.stop();

		const fetched = await msg.fetch();

		const content = t(PingCommand.Language.Pong, {
			dbPing: Math.round(stopwatch.duration),
			roundTrip: fetched.createdTimestamp - interaction.createdTimestamp,
			wsPing: Math.round(this.container.client.ws.ping)
		});

		await msg.edit({ content });
	}

	public async messageRun(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
		const msg = await sendMessage(message, args.t(PingCommand.Language.Ping));

		const stopwatch = new Stopwatch().start();
		await this.container.prisma.$connect();
		stopwatch.stop();

		const content = args.t(PingCommand.Language.Pong, {
			dbPing: Math.round(stopwatch.duration),
			roundTrip: (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp),
			wsPing: Math.round(this.container.client.ws.ping)
		});

		await sendMessage(message, content);
	}

	public static IdHints = [
		'1315313808859861116', // Prod
		'1315209780419366984' // Nightly
	];

	public static Language = LanguageKeys.Commands.General.Ping;
}
