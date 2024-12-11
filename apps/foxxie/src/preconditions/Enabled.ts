import { readSettings } from '#lib/Database/settings/functions';
import { LanguageKeys } from '#lib/i18n';
import { isModerator } from '#utils/discord';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Identifiers, MessageCommand, Precondition, PreconditionContext } from '@sapphire/framework';
import { ChatInputCommandInteraction, GuildMember, Message } from 'discord.js';

@ApplyOptions<Precondition.Options>({
	position: 10
})
export class UserPrecondition extends Precondition {
	public async run(
		{ guildId, channelId, member }: PreconditionEnabledContext,
		command: MessageCommand | ChatInputCommand,
		context: PreconditionContext
	) {
		const { disabledCommands, disabledChannels } = await readSettings(guildId);
		if (disabledChannels.includes(channelId) && !isModerator(member)) return this.error({ context: { silent: true } });

		const matched = disabledCommands.find((key) => this.matchCommand(command, key));
		if (matched && !isModerator(member))
			return this.error({
				identifier: LanguageKeys.Preconditions.CommandDisabledGuild,
				context: { ...context, name: command.name }
			});

		return this.ok();
	}

	public override async messageRun(msg: Message, command: MessageCommand, context: PreconditionContext) {
		if (!command.enabled)
			return this.error({
				identifier: Identifiers.CommandDisabled,
				context
			});

		if (!msg.guild) return this.ok();
		const member = await msg.guild.members.fetch(msg.author.id);

		return this.run({ member, guildId: msg.guild.id, channelId: msg.channel.id }, command, context);
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction, command: ChatInputCommand, context: Precondition.Context) {
		if (!command.enabled)
			return this.error({
				identifier: Identifiers.CommandDisabled,
				context
			});

		if (!interaction.guild) return this.ok();
		const member = await interaction.guild.members.fetch(interaction.user.id);

		return this.run({ member, guildId: interaction.guildId!, channelId: interaction.channelId }, command, context);
	}

	private matchCommand(command: MessageCommand | ChatInputCommand, key: string) {
		const [category, name] = key.split('.');
		const cmdCategory = command.category!.toLowerCase();

		if (!name) return category === command.name || command.aliases.includes(category);

		if (name === '*') return cmdCategory === category;
		if (cmdCategory === category && (command.name === name || command.aliases.includes(name))) return true;
		return false;
	}
}

interface PreconditionEnabledContext {
	guildId: string;
	channelId: string;
	member: GuildMember;
}
