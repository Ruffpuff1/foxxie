import { ModerationCommand } from '#lib/structures';
import { ChatInputArgs, CommandName, GuildInteraction, PermissionLevels } from '#lib/types';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { RegisterChatInputCommand } from '#utils/decorators';
import { cast } from '@ruffpuff/utilities';
import { getModeration } from '#utils/Discord';
import { LanguageKeys } from '#lib/i18n';
import { channelLink } from '#utils/transformers';
import { acquireSettings, GuildSettings } from '#lib/database';
import { enUS } from '#utils/util';

@RegisterChatInputCommand(
    CommandName.Ban,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.Moderation.BanDescription))
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
                    .setRequired(false)
            )
            .addStringOption(option =>
                option //
                    .setName('duration')
                    .setDescription(enUS(LanguageKeys.Commands.Moderation.BanOptionDuration))
                    .setRequired(false)
            )
            .addNumberOption(option =>
                option //
                    .setName('days')
                    .setDescription(enUS(LanguageKeys.Commands.Moderation.BanOptionDays))
                    .setChoices([
                        ['0', 0],
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4],
                        ['5', 5],
                        ['6', 6],
                        ['7', 7]
                    ])
                    .setRequired(false)
            )
            .addIntegerOption(option =>
                option //
                    .setName('refrence')
                    .setDescription(enUS(LanguageKeys.Commands.Moderation.BanOptionRefrence))
                    .setRequired(false)
            ),
    [],
    {
        requiredClientPermissions: PermissionFlagsBits.BanMembers,
        permissionLevel: PermissionLevels.Moderator
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

        const modChannelId = await acquireSettings(interaction.guildId!, GuildSettings.Channels.Logs.Moderation);

        const content = modChannelId
            ? t(this.successKey, {
                  context: 'cases',
                  cases: log.caseId.toString(),
                  targets: [`**${target.tag}**`],
                  count: 1,
                  url: channelLink(interaction.guildId!, modChannelId),
                  reason: reason || t(LanguageKeys.Moderation.NoReason)
              })
            : t(this.successKey, {
                  targets: [`**${target.tag}**`],
                  count: 1,
                  reason: reason || t(LanguageKeys.Moderation.NoReason)
              });

        await interaction.editReply({ content });
    }
}
