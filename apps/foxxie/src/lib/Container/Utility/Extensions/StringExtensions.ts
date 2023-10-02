import { UserDiscogsRelease } from '#Api/LastFm/Structures/UserDiscogsRelease';
import { emojis } from '#utils/constants';
import { bold, italic } from 'discord.js';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class StringExtensions {
    public static userDiscogsWithAlbumName(discogsRelease: UserDiscogsRelease): string {
        let description = '';

        const formatEmote = this.getDiscogsFormatEmote(discogsRelease.release.format);
        description += formatEmote ?? discogsRelease.release.format;

        description += ` - ${bold(
            `[${discogsRelease.release.title}](https://www.discogs.com/release/${discogsRelease.release.discogsId})`
        )}`;

        if (discogsRelease.release.formatText !== null) {
            description += ` - ${italic(discogsRelease.release.formatText)}`;
        }

        if (discogsRelease.rating) {
            description += ' - ';

            for (let i = 0; i < discogsRelease.rating; i++) {
                description += '⭐️';
            }
        }

        return description;
    }

    public static getDiscogsFormatEmote(format: string): string | null {
        switch (format) {
            case 'Vinyl':
                return emojis.vinyl;
            case 'CD':
                return '💿';
            case 'Casette':
                return '📼';
        }

        return null;
    }
}
