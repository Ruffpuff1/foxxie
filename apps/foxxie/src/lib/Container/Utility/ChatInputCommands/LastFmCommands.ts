import { WhoKnowsMode } from '#Api/LastFm/Enums/WhoKnowsMode';
import { SettingsService } from '#Api/LastFm/Services/SettingsService';
import { UserService } from '#Api/LastFm/Services/UserService';
import { ContextModel } from '#Api/LastFm/Structures/Models/ContextModel';
import { WhoKnowsSettings } from '#Api/LastFm/Structures/WhoKnowsSettings';
import { GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import {
    AddEphemeralOption,
    AddStringOption,
    AddTranslatedStringOption,
    AddUserOption,
    MapStringOptionsToChoices,
    NameAndDescriptionToLocalizedSubCommands,
    T
} from '#utils/chatInputDecorators';
import { emojis } from '#utils/constants';
import { RequiresLastFmUsername } from '#utils/decorators';
import { resolveClientColor } from '#utils/util';
import { resolveToNull } from '@ruffpuff/utilities';
import { RequiresClientPermissions } from '@sapphire/decorators';
import { UserError, container } from '@sapphire/framework';
import {
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    PermissionsBitField,
    TimestampStyles,
    time
} from 'discord.js';
import { getFixedT } from 'i18next';
import _ from 'lodash';

const t = new T(getFixedT('en-US'), getFixedT('es-MX'));

export class LastFmChatInputCommands {
    public chatInputCommandData: () => ChatInputApplicationCommandData = () => {
        const detailedDescription = t.englishUS(LanguageKeys.Commands.Fun.LastFmDetailedDescription);
        return {
            name: 'lastfm',
            description: detailedDescription.description,
            dmPermission: false,
            defaultMemberPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]).bitfield,
            nsfw: false,
            options: NameAndDescriptionToLocalizedSubCommands(
                {
                    name: LanguageKeys.Commands.Fun.LastFmChatInputSubcommandArtistName,
                    description: LanguageKeys.Commands.Fun.LastFmChatInputSubcommandArtistDescription,
                    translate: true
                },
                { name: 'globalwhoknows', description: 'see who knows an artist globally' },
                { name: 'stats', description: 'search for lastfm user stats' },
                { name: 'update', description: 'updating ur stats lolz' }
            )
        };
    };

    @RequiresLastFmUsername()
    @RequiresClientPermissions(new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages]))
    @AddTranslatedStringOption(
        LanguageKeys.Commands.Fun.LastFmChatInputOptionArtistName,
        LanguageKeys.Commands.Fun.LastFmChatInputOptionArtistDescription,
        {
            required: false
        }
    )
    @AddEphemeralOption()
    public async artist(...[interaction]: ChatInputRunArgs) {
        const [artist, ephemeral] = await container.apis.lastFm.getArtistArgOrLastPlayedArtistFromGuildMember(interaction);
        await interaction.deferReply({ ephemeral });

        const t = await this.resolveInteractionT(interaction, ephemeral);

        const options = await container.apis.lastFm.artistBuilders.artist(
            new ContextModel(
                { user: interaction.user, guild: interaction.guild, channel: interaction.channel!, t },
                await container.db.users.ensure(interaction.user.id),
                '/'
            ),
            artist
        );

        await interaction.editReply(options);
    }

    @RequiresLastFmUsername()
    @RequiresClientPermissions([
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.AttachFiles
    ])
    @AddTranslatedStringOption(
        LanguageKeys.Commands.Fun.LastFmChatInputOptionArtistName,
        LanguageKeys.Commands.Fun.LastFmChatInputOptionArtistDescription,
        {
            required: false
        }
    )
    @AddEphemeralOption()
    public async globalWhoKnows(...[interaction]: ChatInputRunArgs) {
        const [artistValue, ephemeral] = await container.apis.lastFm.getArtistArgOrLastPlayedArtistFromGuildMember(interaction);
        await interaction.deferReply({ ephemeral });

        const t = await container.utilities.guild(interaction.guild!).settings.getT();
        const contextUser = await container.db.users.ensure(interaction.user.id);

        const currentSettings = new WhoKnowsSettings({
            hidePrivateUsers: false,
            showBotters: false,
            adminView: false,
            newSearchValue: artistValue,
            whoKnowsMode: WhoKnowsMode.Embed
        });

        const options = await this._artistBuilders.globalWhoKnowsArtist(
            new ContextModel({ user: interaction.user, guild: interaction.guild, t, channel: interaction.channel! }, contextUser),
            currentSettings
        );

        await interaction.editReply(options);
    }

    @AddUserOption('user', "The discord user who's lastfm stats to search for (defaults to you).", { required: false })
    @AddEphemeralOption()
    @RequiresClientPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages])
    public async stats(...[interaction]: ChatInputRunArgs) {
        const ephemeral = interaction.options.getBoolean('hidden', false) || false;
        const user = interaction.options.getUser('user', false) || interaction.user;

        await interaction.deferReply({ ephemeral });

        const t = await container.utilities.guild(interaction.guild!).settings.getT();
        const contextUser = await container.db.users.ensure(user.id);
        if (!contextUser.lastFm.username)
            throw new UserError({
                identifier:
                    user.id === interaction.user.id
                        ? LanguageKeys.Commands.Fun.LastFmNotLoggedIn
                        : LanguageKeys.Commands.Fun.LastFmUserNotLoggedIn,
                context: { user: user.username }
            });

        const content = await container.apis.lastFm.userBuilders.stats(
            new ContextModel({ user: interaction.user, guild: interaction.guild, t, channel: interaction.channel! }, contextUser)
        );

        await interaction.editReply(content);
    }

    @RequiresLastFmUsername()
    @RequiresClientPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages])
    @AddStringOption('type', 'The type of update to perform.', {
        required: false,
        choices: MapStringOptionsToChoices('full', 'plays', 'artists', 'albums', 'tracks', 'discogs')
    })
    @AddEphemeralOption()
    public async update(...[interaction]: ChatInputRunArgs) {
        const type = interaction.options.getString('type', false);
        const ephemeral = interaction.options.getBoolean('ephemeral', false) || false;

        const bits = SettingsService.GetUpdateType(type);
        const entity = await container.db.users.ensure(interaction.user.id);

        if (bits.equals(0)) {
            await interaction.reply({
                content: `${emojis.loading} Fetching **${entity.lastFm.username}**'s latest scrobbles.`,
                ephemeral
            });

            const update = await this._updateService.updateUserAndGetRecentTracks(interaction.user);

            if (update?.content.newRecentTracksAmount === 0 && update?.content.removedRecentTracksAmount === 0) {
                const previousUpdate = entity.lastFm.lastUpdated;
                let content = `${emojis.loading} Nothing new found on [**your Last.fm profile**](<https://last.fm/user/${
                    entity.lastFm.username
                }>) since last update ${time(new Date(previousUpdate), TimestampStyles.RelativeTime)}.`;

                if (update.content.recentTracks !== null && update.content.recentTracks.length) {
                    if (!update.content.recentTracks.find(a => a.nowPlaying)) {
                        const latestScrobble = _.maxBy(update.content.recentTracks, o => o.timePlayed);
                        if (latestScrobble && latestScrobble.timePlayed) {
                            const specifiedTime = latestScrobble.timePlayed;

                            content += ` Last scrobble: ${time(specifiedTime, TimestampStyles.RelativeTime)}`;
                        }
                    }
                }

                await interaction.editReply({ content });
            } else {
                let content = '';

                if (update?.content.removedRecentTracksAmount === 0) {
                    content += `${emojis.success} Playcounts have been updated for **${entity.lastFm.username}** based on **${update.content.newRecentTracksAmount}** new scrobbles.`;
                } else if (update?.content.newRecentTracksAmount === 0) {
                    content += `${emojis.success} Cached playcounts have been updated for **${entity.lastFm.username}** based on **${update?.content.removedRecentTracksAmount}** removed scrobbles.`;
                } else {
                    content += `${emojis.success} Cached playcounts have been updated for **${entity.lastFm.username}** based on **${update?.content.newRecentTracksAmount}** new scrobbles, and ${update?.content.removedRecentTracksAmount} removed scrobbles.`;
                }

                await interaction.editReply({ content });
            }

            return;
        }

        const content = `${emojis.loading} Fetching **${entity.lastFm.username}**'s latest scrobbles. I'm updating your full last.fm history so this may take a little bit.`;

        await interaction.reply({ content, ephemeral });

        const result = await this._indexService.modularUpdate(entity, bits);

        const description = UserService.GetIndexCompletedUserStats(entity, result);
        const member = await resolveToNull(interaction.guild.members.fetch(interaction.user.id));

        await interaction.editReply({
            content: null,
            embeds: [
                new EmbedBuilder()
                    .setColor(resolveClientColor(interaction.guild!, member?.displayColor))
                    .setDescription(description)
            ]
        });
    }

    private resolveInteractionT(interaction: ChatInputCommandInteraction, ephemeral?: boolean) {
        if (ephemeral) {
            if (this.languagesHas(interaction.locale)) return getFixedT(this.resolveTKey(interaction.locale));
        }

        return this.resolveGuildT(interaction);
    }

    private async resolveGuildT(interaction: ChatInputCommandInteraction) {
        const setT = await container.utilities.guild(interaction.guild!).settings.get(GuildSettings.Language);

        if (setT !== 'en-US') {
            if (this.languagesHas(setT)) return getFixedT(this.resolveTKey(setT));
        }

        return this.languagesHas(interaction.guildLocale) ? getFixedT(this.resolveTKey(setT)) : getFixedT('en-US');
    }

    private resolveTKey(locale: string): string {
        if (locale === 'es-ES') return 'es-MX';
        return locale;
    }

    private languagesHas(locale: string | null): boolean {
        if (locale === null) return false;
        return ['en-US', 'es-MX', 'es-ES'].includes(locale);
    }

    private get _artistBuilders() {
        return container.apis.lastFm.artistBuilders;
    }

    private get _indexService() {
        return container.apis.lastFm.indexService;
    }

    private get _updateService() {
        return container.apis.lastFm.updateService;
    }
}

type ChatInputRunArgs = [FoxxieCommand.ChatInputCommandInteraction];
