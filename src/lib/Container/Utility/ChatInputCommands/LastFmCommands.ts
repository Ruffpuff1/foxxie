import { WhoKnowsMode } from '#Api/LastFm/Enums/WhoKnowsMode';
import { SettingsService } from '#Api/LastFm/Services/SettingsService';
import { UserService } from '#Api/LastFm/Services/UserService';
import { ContextModel } from '#Api/LastFm/Structures/Models/ContextModel';
import { WhoKnowsSettings } from '#Api/LastFm/Structures/WhoKnowsSettings';
import { GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import {
    AddAttachmentOption,
    AddEphemeralOption,
    AddStringOption,
    AddTranslatedStringOption,
    AddUserOption,
    MapStringOptionsToChoices
} from '#utils/chatInputDecorators';
import { emojis } from '#utils/constants';
import { RequiresLastFmUsername } from '#utils/decorators';
import { resolveClientColor, resolveEmbedField } from '#utils/util';
import { resolveToNull } from '@ruffpuff/utilities';
import { RequiresClientPermissions } from '@sapphire/decorators';
import { UserError, container } from '@sapphire/framework';
import {
    Attachment,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Message,
    PermissionFlagsBits,
    PermissionsBitField,
    TimestampStyles,
    bold,
    inlineCode,
    italic,
    time
} from 'discord.js';
import { getFixedT } from 'i18next';
import _ from 'lodash';
import { List } from '../Extensions/ArrayExtensions';

export class LastFmChatInputCommands {
    @RequiresLastFmUsername()
    @RequiresClientPermissions(new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages]))
    @AddTranslatedStringOption(
        LanguageKeys.Commands.Fun.LastFmChatInputOptionArtistName,
        LanguageKeys.Commands.Fun.LastFmChatInputOptionArtistDescription,
        {
            required: false,
            autocomplete: true
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
            required: false,
            autocomplete: true
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

    @RequiresLastFmUsername()
    @RequiresClientPermissions(new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages]))
    @AddAttachmentOption('file-1', 'spotify file 1', {
        required: true
    })
    @AddEphemeralOption()
    public async importSpotify(...[interaction]: ChatInputRunArgs) {
        const attachment1 = interaction.options.getAttachment('file-1', true);

        const contextUser = await container.db.users.ensure(interaction.user.id);

        let attachments = new List<Attachment | null>([attachment1]);

        const noAttachments = attachments.all(a => a === null);
        attachments = attachments.filter(a => a !== null);

        await interaction.deferReply();
        const member = await resolveToNull(interaction.guild.members.fetch(interaction.user.id));

        const description: string[] = [];
        const embed = new EmbedBuilder().setColor(resolveClientColor(interaction.guild, member?.displayColor));

        if (noAttachments) {
            throw 'no att';
        }

        try {
            embed
                .setAuthor({ name: 'Importing spotify into foxxie...' })
                .setDescription(`${emojis.loading} Loading import files...`);
            const message = await interaction.editReply({ embeds: [embed] });
            console.log(message, description);

            const [status, result, processedFiles] = await this._importService.handleSpotifyFiles(
                attachments as List<Attachment>
            );

            if (status === 1) {
                await this.updateImportEmbed(message, embed, description, 'Invalid Spotify import file.');
                return;
            }

            await this.updateImportEmbed(
                message,
                embed,
                description,
                `${bold(result!.length.toLocaleString())} Spotify imports found`
            );

            const plays = await this._importService.spotifyImportToUserPlays(contextUser, result!);
            await this.updateImportEmbed(
                message,
                embed,
                description,
                `${bold(plays!.length.toLocaleString())} actual plays found`
            );

            const playsWithoutDuplicates = await this._importService.removeDuplicateSpotifyImports(contextUser.id, plays);
            await this.updateImportEmbed(
                message,
                embed,
                description,
                `${bold(playsWithoutDuplicates.length.toLocaleString())} new plays found`
            );

            if (playsWithoutDuplicates.length) {
                await this._importService.insertImportPlays(contextUser, playsWithoutDuplicates);
                await this.updateImportEmbed(message, embed, description, `- Added plays to database`);
            }

            await this._indexService.recalculateTopLists(contextUser);
            await this.updateImportEmbed(message, embed, description, `- Recalculated top lists`);

            const files = new List();
            for (const attachment of processedFiles!
                .orderBy(o => o)
                .take(4)
                .toArray()) {
                files.push(inlineCode(attachment));
            }

            if (processedFiles!.length > 4) {
                files.push(italic(`*+ ${processedFiles!.length} more files...*`));
            }

            embed.addFields(resolveEmbedField('Processed files', files.stringify()));

            await this.updateImportEmbed(message, embed, description, `${emojis.success} Import completed`, true);
        } catch {}
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

    private async updateImportEmbed(
        message: Message<boolean>,
        embed: EmbedBuilder,
        builder: string[],
        lineToAdd: string,
        finalLine = false,
        components = null,
        image = null
    ) {
        builder.push(lineToAdd);

        const loadingLine = `${emojis.loading} Loading import files...`;
        const appended = finalLine ? '' : `\n${loadingLine}`;

        embed.setDescription(`${builder.filter(e => Boolean(e)).join('\n')}${appended}`);

        if (image) console.log(image, components);

        await message.edit({ embeds: [embed] });
    }

    private get _artistBuilders() {
        return container.apis.lastFm.artistBuilders;
    }

    private get _importService() {
        return container.apis.lastFm.importService;
    }

    private get _indexService() {
        return container.apis.lastFm.indexService;
    }

    private get _updateService() {
        return container.apis.lastFm.updateService;
    }
}

type ChatInputRunArgs = [FoxxieCommand.ChatInputCommandInteraction];
