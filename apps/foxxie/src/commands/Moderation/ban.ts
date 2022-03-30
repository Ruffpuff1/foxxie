import { ModerationCommand } from '#lib/structures';
import { ChatInputArgs, CommandName, GuildInteraction, PermissionLevels } from '#lib/types';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { RegisterChatInputCommand } from '@foxxie/commands';
import { cast } from '@ruffpuff/utilities';
import { getModeration } from '#utils/Discord';
import { LanguageKeys } from '#lib/i18n';
import { enUS, getGuildIds, interactionPrompt } from '#utils/util';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { GuildMember, User } from 'discord.js';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Ban)
            .setDescription(LanguageKeys.Commands.Moderation.BanDescription)
            .addUserOption(option =>
                option //
                    .setName('target')
                    .setDescription(enUS(LanguageKeys.Commands.Moderation.BanOptionTarget))
                    .setRequired(true)
            )
            .addStringOption(option =>
                option //
                    .setName('reason')
                    .setDescription(enUS(LanguageKeys.Commands.Moderation.BanOptionReason))
            )
            .addStringOption(option =>
                option //
                    .setName('duration')
                    .setDescription(enUS(LanguageKeys.Commands.Moderation.BanOptionDuration))
            )
            .addNumberOption(option =>
                option //
                    .setName('days')
                    .setDescription(enUS(LanguageKeys.Commands.Moderation.BanOptionDays))
                    .addChoices([
                        ['None (Default)', 0],
                        ['One', 1],
                        ['Two', 2],
                        ['Three', 3],
                        ['Four', 4],
                        ['Five', 5],
                        ['Six', 6],
                        ['Seven', 7]
                    ])
            )
            .addNumberOption(option =>
                option //
                    .setName('refrence')
                    .setDescription(enUS(LanguageKeys.Commands.Moderation.BanOptionRefrence))
            ),
    {
        requiredClientPermissions: PermissionFlagsBits.BanMembers,
        guildIds: getGuildIds(),
        ...({
            permissionLevel: PermissionLevels.Moderator
        } as any)
    }
)
export class UserCommand extends ModerationCommand {
    public duration = true;

    public memberOnly = false;

    public successKey = LanguageKeys.Commands.Moderation.BanSuccess;

    public async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Ban>) {
        const {
            t,
            target: { user: target },
            duration,
            reason,
            days,
            refrence
        } = args!;

        await interaction.deferReply({ ephemeral: true });

        await this.checkModerable(cast<GuildInteraction>(interaction), { t, target });

        const result = await interactionPrompt(interaction, t(LanguageKeys.Commands.Moderation.BanConfirm, { target: `**${target.tag}**` }), t);
        if (result === false) {
            await interaction.editReply({ content: t(LanguageKeys.System.CommandCancel), components: [] });
            return;
        }

        const resolvedDuration = await this.resolveDuration(duration);

        await this.container.redis!.insert(`guild:${interaction.guild!.id}:ban:${target.id}`, '');

        const log = await getModeration(interaction.guild!).actions.ban(
            {
                userId: target.id,
                channelId: interaction.channelId,
                moderatorId: interaction.user.id,
                reason: reason ?? null,
                duration: resolvedDuration,
                refrence: refrence ?? null
            },
            days || 0,
            await this.getDmData(cast<GuildInteraction>(interaction))
        );

        await this.respond(cast<GuildInteraction>(interaction), log, target);
    }

    protected async checkModerable(interaction: GuildInteraction, context: { t: TFunction; target: User }): Promise<GuildMember | null> {
        const member = await super.checkModerable(interaction, context);
        if (member && !member.bannable) throw context.t(LanguageKeys.Listeners.Errors.ModerationBannable, { target: `**${context.target.tag}**` });
        return member;
    }
}
