import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Identifiers, MessageCommand, Precondition, PreconditionContext } from '@sapphire/framework';
import { readSettings } from '#lib/Database/settings/functions';
import { LanguageKeys } from '#lib/i18n';
import { isModerator } from '#utils/discord';
import { ChatInputCommandInteraction, GuildMember, Message } from 'discord.js';

@ApplyOptions<Precondition.Options>({
	position: 10
})
export class UserPrecondition extends Precondition {
	public override async chatInputRun(interaction: ChatInputCommandInteraction, command: ChatInputCommand, context: Precondition.Context) {
		if (!command.enabled)
			return this.error({
				context,
				identifier: Identifiers.CommandDisabled
			});

		if (!interaction.guild) return this.ok();
		const member = await interaction.guild.members.fetch(interaction.user.id);

		return this.run({ channelId: interaction.channelId, guildId: interaction.guildId!, member }, command, context);
	}

	public override async messageRun(msg: Message, command: MessageCommand, context: PreconditionContext) {
		if (!command.enabled)
			return this.error({
				context,
				identifier: Identifiers.CommandDisabled
			});

		if (!msg.guild) return this.ok();
		const member = await msg.guild.members.fetch(msg.author.id);

		return this.run({ channelId: msg.channel.id, guildId: msg.guild.id, member }, command, context);
	}

	public async run(
		{ channelId, guildId, member }: PreconditionEnabledContext,
		command: ChatInputCommand | MessageCommand,
		context: PreconditionContext
	) {
		const { disabledChannels, disabledCommands } = await readSettings(guildId);
		if (disabledChannels.includes(channelId) && !isModerator(member)) return this.error({ context: { silent: true } });

		const matched = disabledCommands.find((key) => this.matchCommand(command, key));
		if (matched && !isModerator(member))
			return this.error({
				context: { ...context, name: command.name },
				identifier: LanguageKeys.Preconditions.CommandDisabledGuild
			});

		return this.ok();
	}

	private matchCommand(command: ChatInputCommand | MessageCommand, key: string) {
		const [category, name] = key.split('.');
		const cmdCategory = command.category!.toLowerCase();

		if (!name) return category === command.name || command.aliases.includes(category);

		if (name === '*') return cmdCategory === category;
		if (cmdCategory === category && (command.name === name || command.aliases.includes(name))) return true;
		return false;
	}
}

interface PreconditionEnabledContext {
	channelId: string;
	guildId: string;
	member: GuildMember;
}
