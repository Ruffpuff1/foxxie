import { LanguageKeys } from '#lib/I18n';
import { isModerator } from '#utils/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { Identifiers, MessageCommand, Precondition, PreconditionContext } from '@sapphire/framework';
import type { GuildMember, Message } from 'discord.js';

@ApplyOptions<Precondition.Options>({
    position: 10
})
export class UserPrecondition extends Precondition {
    public async run(
        { guildId, channelId, member }: PreconditionEnabledContext,
        command: MessageCommand,
        context: PreconditionContext
    ) {
        const { disabledCommands, disabledChannels } = await this.container.settings.readGuild(guildId);
        if (disabledChannels.includes(channelId) && !isModerator(member)) return this.error({ context: { silent: true } });

        const matched = disabledCommands.find(key => this.matchCommand(command, key));
        if (matched && !isModerator(member))
            return this.error({
                identifier: LanguageKeys.Preconditions.CommandDisabledGuild,
                context: { ...context, name: command.name }
            });

        return this.ok();
    }

    public async messageRun(msg: Message, command: MessageCommand, context: PreconditionContext) {
        if (!command.enabled)
            return this.error({
                identifier: Identifiers.CommandDisabled,
                context
            });

        if (!msg.guild) return this.ok();
        const member = await msg.guild.members.fetch(msg.author.id);

        return this.run({ member, guildId: msg.guild.id, channelId: msg.channel.id }, command, context);
    }

    private matchCommand(command: MessageCommand, key: string) {
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
