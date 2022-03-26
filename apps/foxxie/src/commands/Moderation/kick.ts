import { ModerationCommand } from '#lib/structures/moderation/ModerationCommand';
import { ChatInputArgs, CommandName, GuildInteraction, PermissionLevels } from '#lib/types';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { RegisterChatInputCommand } from '#utils/decorators';
import { cast } from '@ruffpuff/utilities';
import { getModeration } from '#utils/Discord';
import { LanguageKeys } from '#lib/i18n';
import { enUS, interactionPrompt } from '#utils/util';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { GuildMember, User } from 'discord.js';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Kick)
            .setDescription(LanguageKeys.Commands.Moderation.KickDescription)
            .addUserOption(option =>
                option //
                    .setName('target')
                    .setDescription(enUS(LanguageKeys.Commands.Moderation.KickOptionTarget))
                    .setRequired(true)
            )
            .addStringOption(option =>
                option //
                    .setName('reason')
                    .setDescription(enUS(LanguageKeys.Commands.Moderation.KickOptionReason))
            )
            .addNumberOption(option =>
                option //
                    .setName('refrence')
                    .setDescription(enUS(LanguageKeys.Commands.Moderation.KickOptionRefrence))
            ),
    {
        requiredClientPermissions: PermissionFlagsBits.KickMembers,
        permissionLevel: PermissionLevels.Moderator
    }
)
export class UserCommand extends ModerationCommand {
    public duration = false;

    public memberOnly = true;

    public successKey = LanguageKeys.Commands.Moderation.KickSuccess;

    public async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Kick>) {
        const {
            t,
            target: { user: target },
            reason,
            refrence
        } = args!;

        await interaction.deferReply({ ephemeral: true });

        await this.checkModerable(cast<GuildInteraction>(interaction), { t, target });

        const result = await interactionPrompt(interaction, t(LanguageKeys.Commands.Moderation.KickConfirm, { target: `**${target.tag}**` }), t);
        if (result === false) {
            await interaction.editReply({ content: t(LanguageKeys.System.CommandCancel), components: [] });
            return;
        }

        await this.container.redis!.insert(`guild:${interaction.guild!.id}:kick:${target.id}`, '');

        const log = await getModeration(interaction.guild!).actions.kick(
            {
                userId: target.id,
                channelId: interaction.channelId,
                moderatorId: interaction.user.id,
                reason: reason ?? null,
                duration: null,
                refrence: refrence ?? null
            },
            await this.getDmData(cast<GuildInteraction>(interaction))
        );

        await this.respond(cast<GuildInteraction>(interaction), log, target);
    }

    protected async checkModerable(interaction: GuildInteraction, context: { t: TFunction; target: User }): Promise<GuildMember | null> {
        const member = await super.checkModerable(interaction, context);
        if (member && !member.kickable) throw context.t(LanguageKeys.Listeners.Errors.ModerationKickable, { target: `**${context.target.tag}**` });
        return member;
    }
}
