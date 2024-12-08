import { readSettings } from '#lib/database';
import { getSupportedUserLanguageT, LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Awaitable } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Stopwatch } from '@sapphire/stopwatch';
import { InteractionContextType } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
	aliases: ['pong'],
	description: LanguageKeys.Commands.General.PingDescription
})
export default class UserCommand extends FoxxieCommand {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): Awaitable<void> {
		registry.registerChatInputCommand((builder) => builder.setName('ping').setDescription('pong').setContexts(InteractionContextType.Guild), {
			idHints: ['1315209780419366984']
		});
	}

	public async messageRun(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
		const msg = await send(message, { content: args.t(LanguageKeys.Commands.General.Ping), embeds: undefined });

		const stopwatch = new Stopwatch().start();
		await readSettings(message.guild.id);
		stopwatch.stop();

		const content = args.t(LanguageKeys.Commands.General.PingPong, {
			roundTrip: (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp),
			wsPing: Math.round(this.container.client.ws.ping),
			dbPing: Math.round(stopwatch.duration)
		});

		await send(message, content);
	}

	public override async chatInputRun(interaction: FoxxieCommand.ChatInputCommandInteraction): Promise<void> {
		const t = getSupportedUserLanguageT(interaction);
		const show = interaction.options.getBoolean('show') ?? false;
		const msg = await interaction.reply({ content: t(LanguageKeys.Commands.General.Ping), embeds: undefined, ephemeral: !show });

		const stopwatch = new Stopwatch().start();
		await readSettings(interaction.guild.id);
		stopwatch.stop();

		const fetched = await msg.fetch();

		const content = t(LanguageKeys.Commands.General.PingPong, {
			roundTrip: fetched.createdTimestamp - interaction.createdTimestamp,
			wsPing: Math.round(this.container.client.ws.ping),
			dbPing: Math.round(stopwatch.duration)
		});

		await msg.edit({ content });
	}
}
