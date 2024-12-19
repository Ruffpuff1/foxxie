import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { Stopwatch } from '@sapphire/stopwatch';
import { getSupportedUserLanguageT, LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { RegisterChatInputCommand } from '#utils/decorators';
import { sendMessage } from '#utils/functions';
import { InteractionContextType, SlashCommandBuilder } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>(PingCommand.Options)
@RegisterChatInputCommand(PingCommand.ChatInputBuilder, PingCommand.IdHints)
export default class PingCommand extends FoxxieCommand {
	public override async chatInputRun(interaction: FoxxieCommand.ChatInputCommandInteraction): Promise<void> {
		const t = getSupportedUserLanguageT(interaction);
		const show = interaction.options.getBoolean('show') ?? false;
		const msg = await interaction.reply({ content: t(PingCommand.Language.Ping), embeds: undefined, ephemeral: !show });

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

	public static ChatInputBuilder(builder: SlashCommandBuilder) {
		return builder //
			.setName('ping')
			.setDescription('pong')
			.setContexts(InteractionContextType.Guild);
	}

	public static IdHints = [
		'1315209780419366984' // Nightly
	];

	public static Language = LanguageKeys.Commands.General.Ping;

	public static Options: FoxxieCommand.Options = {
		aliases: ['pong'],
		description: PingCommand.Language.Description,
		runIn: [CommandOptionsRunTypeEnum.Dm, CommandOptionsRunTypeEnum.GuildAny]
	};
}
