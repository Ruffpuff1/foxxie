import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from 'discord.js';
import { ArtistsService } from '../Services/ArtistsService';

export class ArtistAutoComplete {
    private _artistsService = new ArtistsService();

    public async generateSuggestions(
        interaction: AutocompleteInteraction
    ): Promise<ApplicationCommandOptionChoiceData<string>[]> {
        const recentlyPlayedArtists = await this._artistsService.getLatestArtists(interaction.user.id);
        const recentTopArtists = await this._artistsService.getRecentTopArtists(interaction.user.id);

        const current = interaction.options.getFocused(true);

        let results = new List<string>();

        if (current.value) {
            const searchValue = current.value;
            results = new List<string>([searchValue]);

            const artistResults = await this._artistsService.searchThroughArtists(searchValue);

            results.addRange(recentlyPlayedArtists.filter(w => w.toLowerCase().startsWith(searchValue.toLowerCase())).take(4));

            results.addRange(recentTopArtists.filter(w => w.toLowerCase().startsWith(searchValue.toLowerCase())).take(4));

            results.addRange(recentlyPlayedArtists.filter(w => w.toLowerCase().includes(searchValue.toLowerCase())).take(2));

            results.addRange(recentTopArtists.filter(w => w.toLowerCase().includes(searchValue.toLowerCase())).take(3));

            results.addRange(
                artistResults
                    .filter(w => (w.popularity || 0) > 60 && w.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .take(2)
                    .map(s => s.name)
            );

            results.addRange(
                artistResults
                    .filter(w => w.name.toLowerCase().startsWith(searchValue.toLowerCase()))
                    .take(4)
                    .map(s => s.name)
            );

            results.addRange(
                artistResults
                    .filter(w => w.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .take(2)
                    .map(s => s.name)
            );
        } else {
            if (!recentlyPlayedArtists.length || !recentTopArtists.length) {
                results.addRange(['Start typing to search through artists...']);

                return results.map(r => ({ name: r, value: r })).toArray();
            }

            results.addRange(recentlyPlayedArtists.take(4));
            results.addRange(recentTopArtists.take(4));
        }

        return results
            .distinct()
            .map(r => ({ name: r, value: r }))
            .toArray();
    }
}
