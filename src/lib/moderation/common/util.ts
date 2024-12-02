import { TFunction } from 'i18next';
import { GuildModerationService } from '../managers/GuildModerationService';
import { chatInputApplicationCommandMention, EmbedBuilder, GuildChannel, messageLink, Snowflake, User } from 'discord.js';
import { LanguageKeys } from '#lib/I18n/index';
import { container } from '@sapphire/framework';
import { FoxxieCommand } from '#lib/Structures/index';
import { resolveToNull } from '@ruffpuff/utilities';
import { TypeVariation } from '#lib/util/moderation';
import { getColor, TranslationMappings } from './constants';

export function getTranslationKey<const Type extends TypeVariation>(type: Type): (typeof TranslationMappings)[Type] {
    return TranslationMappings[type];
}

export function getTitle(t: TFunction, entry: GuildModerationService.Entry): string {
    const name = t(getTranslationKey(entry.type));
    // if (entry.isUndo()) return t(Root.MetadataUndo, { name });
    // if (entry.isTemporary()) return t(Root.MetadataTemporary, { name });
    return name;
}

export async function getEmbed(t: TFunction, entry: GuildModerationService.Entry) {
    const moderator = await entry.fetchModerator();
    const caseT = t(LanguageKeys.Globals.CaseT);
    const type = getTitle(t, entry);
    const modMember = await resolveToNull(entry.guild.members.fetch(moderator));

    const embed = new EmbedBuilder()
        .setColor(getColor(entry))
        .setAuthor({
            name: type,
            iconURL: modMember?.displayAvatarURL() || moderator.displayAvatarURL()
        })
        .setDescription(await getEmbedDescription(t, entry, moderator))
        .setFooter({
            text: `${caseT} #${t(LanguageKeys.Globals.NumberFormat, {
                value: entry.id
            })}`
        })
        .setTimestamp(entry.createdAt);

    return embed;
}

async function fetchRefrenceCase(entry: GuildModerationService.Entry) {
    if (!entry.refrenceId) return null;
    const ref = await container.utilities.guild(entry.guild).moderation.fetch(entry.refrenceId);
    return ref;
}

async function fetchEntryChannel(entry: GuildModerationService.Entry) {
    const channel = entry.channelId ? ((await resolveToNull(entry.guild.channels.fetch(entry.channelId))) as GuildChannel) : null;
    return channel;
}

async function getEmbedDescription(t: TFunction, entry: GuildModerationService.Entry, moderator: User) {
    const reason = entry.reason
        ? entry.imageURL
            ? `${entry.reason} ⎾[Proof](${entry.imageURL})⏌`
            : entry.reason
        : t(LanguageKeys.Moderation.FillReason, { prefix: '.', count: entry.id });
    const user = await resolveToNull(entry.fetchUser());
    const refrence = await fetchRefrenceCase(entry);
    const channel = await fetchEntryChannel(entry);

    const userLine = user ? t(LanguageKeys.Guilds.Logs.ArgsUser, { user }) : null;
    const channelLine = channel ? t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel }) : null;
    const modLine = moderator ? t(LanguageKeys.Guilds.Logs.ArgsModerator, { mod: moderator }) : null;
    const durationLine = entry.duration
        ? t(LanguageKeys.Guilds.Logs.ArgsDuration, {
              duration: Date.now() - entry.duration
          })
        : null;
    const reasonLine = t(LanguageKeys.Guilds.Logs.ArgsReason, { reason });
    const refrenceLine = refrence
        ? t(LanguageKeys.Guilds.Logs.ArgsRefrence, {
              id: refrence.id,
              url: messageLink(refrence.logChannelId!, refrence.logMessageId!, entry.guild.id)
          })
        : null;

    return [userLine, modLine, channelLine, durationLine, reasonLine, refrenceLine].filter(a => !!a).join('\n');
}

let caseCommandId: Snowflake | null = null;
export function getCaseEditMention() {
    caseCommandId ??= (container.stores.get('commands').get('case') as FoxxieCommand).getGlobalCommandId();
    return chatInputApplicationCommandMention('case', 'edit', caseCommandId);
}
