import { ContextModel } from '#Api/LastFm/Structures/Models/ContextModel';
import { LanguageKeys } from '#lib/I18n';
import { resolveClientColor, resolveEmbedField } from '#utils/util';
import { AmiiboSeriesEnum, StarSignEnum } from '@foxxie/celestia-api-types';
import { cast, toTitleCase } from '@ruffpuff/utilities';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { EmbedBuilder, italic } from 'discord.js';
import { Villager } from '../Structures/Villager';
import { formatGames, getZodiacEmoji } from '../celestia';

export class VillagerBuilders {
    public villager(villagerData: Villager, context: ContextModel) {
        const none = context.t(LanguageKeys.Globals.None);
        const titles = context.t(LanguageKeys.Commands.Fun.AnimalcrossingTitles);
        const member = context.guild.members.cache.get(context.user.id);

        const color = resolveClientColor(context.guild, member?.displayColor);

        const template = new EmbedBuilder() //
            .setAuthor({
                name: `${toTitleCase(villagerData.name)} [${villagerData.nameJapanese}]`,
                iconURL: villagerData.art.icon || undefined
            })
            .setColor(color)
            .setFooter({ text: 'Powered by Celestia.reese.gay' });

        const display = new PaginatedMessage({ template }).addPageEmbed(embed => {
            embed
                .setThumbnail(villagerData.art.villager)
                .addFields([
                    resolveEmbedField(titles.personality, villagerData.personality || none, true),
                    resolveEmbedField(titles.species, villagerData.species ? toTitleCase(villagerData.species) : none, true),
                    resolveEmbedField(titles.gender, villagerData.gender, true),
                    resolveEmbedField(
                        context.t(`${LanguageKeys.Commands.Fun.AnimalcrossingTitles}.game`, { count: villagerData.games.length }),
                        context.t(LanguageKeys.Globals.And, { value: formatGames(villagerData.games) })
                    ),
                    resolveEmbedField(titles.catchphrase, villagerData.catchphrase || none, true),
                    resolveEmbedField(titles.saying, villagerData.favoriteSaying || none, true)
                ]);

            if (villagerData.description) embed.setDescription(italic(villagerData.description));

            return embed;
        });

        const hasTrivia = Boolean(villagerData.siblings || villagerData.skill || villagerData.goal);

        display.addPageEmbed(embed => {
            embed.setThumbnail(villagerData.art.villager);

            if (hasTrivia) {
                embed.addFields(
                    resolveEmbedField(titles.siblings, villagerData.siblings || none, true),
                    resolveEmbedField(titles.skill, villagerData.skill || none, true),
                    resolveEmbedField(titles.goal, villagerData.goal || none, true)
                );
            }

            if (villagerData.coffeeRequest) {
                embed.addFields(
                    resolveEmbedField(
                        titles.coffee,
                        context.t(LanguageKeys.Commands.Fun.AnimalcrossingCoffee, {
                            beans: villagerData.coffeeRequest?.beans,
                            milk: villagerData.coffeeRequest?.milk,
                            sugar: villagerData.coffeeRequest?.sugar
                        }),
                        true
                    )
                );
            }

            if (villagerData.amiibo) {
                embed.addFields(
                    resolveEmbedField(
                        '• Amiibo',
                        `${
                            villagerData.amiibo.series === AmiiboSeriesEnum.Camper ||
                            villagerData.amiibo.series === AmiiboSeriesEnum.Sanrio
                                ? villagerData.amiibo.series
                                : `Series ${villagerData.amiibo.series}`
                        } → #${villagerData.amiibo.cardNumber}`,
                        true
                    )
                );
            }

            embed.addFields(
                resolveEmbedField(
                    titles.birthday,
                    `${getZodiacEmoji(cast<StarSignEnum>(villagerData.birthday.zodiac))} ${
                        villagerData.birthday.month
                    } ${context.t(LanguageKeys.Globals.NumberOrdinal, { value: villagerData.birthday.day })}`,
                    true
                )
            );

            if (villagerData.song) {
                embed.addFields(resolveEmbedField(titles.song, villagerData.song || none));
            }

            if (villagerData.description) embed.setDescription(italic(villagerData.description));

            return embed;
        });

        if (villagerData.art.card) {
            if (Array.isArray(villagerData.art.card)) {
                for (const c of villagerData.art.card) {
                    display.addPageEmbed(embed => embed.setImage(c));
                }
            } else {
                display.addPageEmbed(embed => embed.setImage(villagerData.art.card as string));
            }
        }

        return display;
    }
}
