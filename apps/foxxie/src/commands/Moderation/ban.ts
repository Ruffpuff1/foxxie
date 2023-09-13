import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand } from '#lib/structures';
import { getModeration } from '#utils/Discord';
import { seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry } from '@sapphire/framework';
import { ArgumentTypes } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

@ApplyOptions<ModerationCommand.Options>({
    aliases: ['b'],
    detailedDescription: LanguageKeys.Commands.Moderation.BanDetailedDescription,
    duration: true,
    requiredClientPermissions: [PermissionFlagsBits.BanMembers],
    memberOnly: false,
    options: ['days', 'reference'],
    successKey: LanguageKeys.Commands.Moderation.BanSuccess
})
export class UserCommand extends ModerationCommand {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(builder =>
            builder
                .setName(this.name)
                .setDescription('ban server members')
                .setDMPermission(false)
                .setDefaultMemberPermissions(new PermissionsBitField([PermissionFlagsBits.BanMembers]).bitfield)
                .setNSFW(false)
                .addUserOption(option => option.setName('user').setDescription('the user to ban').setRequired(true))
                .addStringOption(option =>
                    option.setName('reason').setDescription('the reason for the ban').setRequired(false).setMaxLength(2000)
                )
                .addNumberOption(option =>
                    option
                        .setName('days')
                        .setDescription('the number of days worth of messages to delete')
                        .setRequired(false)
                        .setChoices(
                            { name: '1', value: 1 },
                            { name: '2', value: 2 },
                            { name: '3', value: 3 },
                            { name: '4', value: 4 },
                            { name: '5', value: 5 },
                            { name: '6', value: 6 },
                            { name: '7', value: 7 }
                        )
                )
                .addNumberOption(option =>
                    option.setName('reference').setDescription('the optional case to refrence').setMinValue(1).setRequired(false)
                )
                .addBooleanOption(option =>
                    option.setName('no-dm').setDescription('whether i shouldnt dm the member').setRequired(false)
                )
                .addBooleanOption(option =>
                    option.setName('dm').setDescription('whether i should dm the member').setRequired(false)
                )
                .addBooleanOption(option => option.setName('hidden').setDescription('whether to hide').setRequired(false))
        );
    }

    public async prehandle(...[message, context]: ArgumentTypes<ModerationCommand['messagePrehandle']>) {
        await Promise.all(
            context.targets.map(
                user => this.container.redis?.pinsertex(`guild:${message.guild.id}:ban:${user.id}`, seconds(20), '')
            )
        );
    }

    public async messageHandle(...[message, context]: ArgumentTypes<ModerationCommand['messageHandle']>) {
        return getModeration(message.guild).actions.ban(
            {
                userId: context.target.id,
                moderatorId: message.author.id,
                channelId: message.channel.id,
                duration: context.duration,
                reason: context.reason,
                guildId: message.guild.id,
                refrence: context.args.getOption('reference') ? Number(context.args.getOption('reference')) : null
            },
            Number(context.args.getOption('days')),
            await this.messageGetDmData(message, context)
        );
    }

    public async checkModeratable(...[message, context]: ArgumentTypes<ModerationCommand['messageCheckModeratable']>) {
        const member = await super.messageCheckModeratable(message, context);
        if (member && !member.bannable)
            throw context.args.t(LanguageKeys.Listeners.Errors.ModerationBannable, { target: `**${context.target.username}**` });
        return member;
    }

    public async chatInputHandle(...[interaction, context]: ArgumentTypes<ModerationCommand['chatInputHandle']>) {
        const reference = interaction.options.getNumber('reference');

        return getModeration(interaction.guild).actions.ban(
            {
                userId: context.target.id,
                moderatorId: interaction.user.id,
                channelId: interaction.channelId,
                duration: context.duration,
                reason: context.reason,
                guildId: interaction.guildId,
                refrence: reference ? Number(reference) : null
            },
            this.chatInputGetDays(interaction),
            await this.chatInputGetDmData(interaction)
        );
    }
}
