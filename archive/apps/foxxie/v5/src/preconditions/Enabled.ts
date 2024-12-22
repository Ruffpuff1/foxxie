import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Identifiers, Precondition, PreconditionContext } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { acquireSettings, GuildSettings } from '#lib/database';
import type { FoxxieCommand } from '#lib/structures';
import { isModerator } from '#utils/Discord';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<Precondition.Options>({
    position: 10
})
export class UserPrecondition extends Precondition {
    public async chatInputRun(interaction: CommandInteraction, command: ChatInputCommand, context: PreconditionContext) {
        if (!command.enabled)
            return this.error({
                identifier: Identifiers.CommandDisabled,
                context: { context: 'chatinput' }
            });
        if (!interaction.guild) return this.ok();

        const [disabledCommands, disabledChannels, commandChannels] = await acquireSettings(interaction.guild, [
            GuildSettings.DisabledCommands,
            GuildSettings.DisabledChannels,
            GuildSettings.CommandChannels
        ]);

        const member = interaction.guild.members.cache.get(interaction.user.id);

        if (disabledChannels.includes(interaction.channel!.id) && !isModerator(member!)) return this.error({ context: { silent: true } });
        if (commandChannels.length && !commandChannels.includes(interaction.channel!.id) && !isModerator(member!)) return this.error({ context: { silent: true } });

        const matched = disabledCommands.find(key => this.matchCommand(command as FoxxieCommand, key));
        if (matched && !isModerator(member!))
            return this.error({
                identifier: LanguageKeys.Preconditions.CommandDisabledGuild,
                context: { ...context, name: command.name }
            });

        return this.ok();
    }

    public async messageRun(msg: Message, command: FoxxieCommand, context: PreconditionContext) {
        if (!command.enabled)
            return this.error({
                identifier: Identifiers.CommandDisabled,
                context
            });
        if (!msg.guild) return this.ok();

        const [disabledCommands, disabledChannels, commandChannels] = await acquireSettings(msg.guild, [
            GuildSettings.DisabledCommands,
            GuildSettings.DisabledChannels,
            GuildSettings.CommandChannels
        ]);

        if (disabledChannels.includes(msg.channel.id) && !isModerator(msg.member!)) return this.error({ context: { silent: true } });
        if (commandChannels.length && !commandChannels.includes(msg.channel.id) && !isModerator(msg.member!)) return this.error({ context: { silent: true } });

        const matched = disabledCommands.find(key => this.matchCommand(command, key));
        if (matched && !isModerator(msg.member!))
            return this.error({
                identifier: LanguageKeys.Preconditions.CommandDisabledGuild,
                context: { ...context, name: command.name }
            });

        return this.ok();
    }

    private matchCommand(command: FoxxieCommand, key: string) {
        const [category, name] = key.split('.');
        const cmdCategory = command.category!.toLowerCase();

        if (!name) return category === command.name || command.aliases.includes(category);

        if (name === '*') return cmdCategory === category;
        if (cmdCategory === category && (command.name === name || command.aliases.includes(name))) return true;
        return false;
    }
}
