import { LastFmArtistGetInfoResult } from '#lib/Api/LastFmService';
import { acquireSettings } from '#lib/database';
import { floatPromise, resolveClientColor } from '#utils/util';
import { cast, resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { SelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
        let display: PaginatedMessage;
        const t = await acquireSettings(interaction.guildId!, s => s.getLanguage());
        const message = await resolveToNull(interaction.channel!.messages.fetch(result.messageId));

        const artistEntity = await this.container.apis.spotify.getOrStoreArtist(cast<LastFmArtistGetInfoResult>(result.data));

        switch (result.type) {
            case 'artist':
                display = await this.container.apis.lastFm.buildArtistDisplay(
                    cast<LastFmArtistGetInfoResult>(result.data).artist,
                    artistEntity,
                    t,
                    resolveClientColor(message?.guildId as string, message?.member?.displayColor || 0),
                    interaction.user.id,
                    interaction.guildId!
                );
                break;
        }

        if (message) await floatPromise(interaction.message.delete());

        return display.run(message ?? interaction, message ? message.author : interaction.user);
    }

    public override async parse(interaction: SelectMenuInteraction) {
        if (!interaction.customId.startsWith('lastfm|')) return this.none();

        const value = interaction.values[0];
        const [, type, messageId] = interaction.customId.split('|') as [never, 'artist', string];
        let data;

        switch (type) {
            case 'artist':
                data = await this.container.apis.lastFm.getInfoFromArtist(value);
                break;
        }

        return this.some({ data, type, messageId });
    }
}
