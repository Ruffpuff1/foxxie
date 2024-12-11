import { Emojis } from '#utils/constants';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class StringFormattersService {
	// public static UserDiscogsWithAlbumName(discogsRelease: UserDiscogsRelease): string {
	//     let description = '';

	//     const formatEmote = this.GetDiscogsFormatEmote(discogsRelease.release.format);
	//     description += formatEmote ?? discogsRelease.release.format;

	//     description += ` - ${bold(
	//         `[${discogsRelease.release.title}](https://www.discogs.com/release/${discogsRelease.release.discogsId})`
	//     )}`;

	//     if (discogsRelease.release.formatText !== null) {
	//         description += ` - ${italic(discogsRelease.release.formatText)}`;
	//     }

	//     if (discogsRelease.rating) {
	//         description += ' - ';

	//         for (let i = 0; i < discogsRelease.rating; i++) {
	//             description += '⭐️';
	//         }
	//     }

	//     return description;
	// }

	public getDiscogsFormatEmote(format: string): null | string {
		switch (format) {
			case 'Casette':
				return '📼';
			case 'CD':
				return '💿';
			case 'Vinyl':
				return Emojis.Vinyl;
		}

		return null;
	}

	public keyIntToPitchString(key: number) {
		switch (key) {
			case 0:
				return 'C';
			case 1:
				return 'C#';
			case 10:
				return 'A#';
			case 11:
				return 'B';
			case 2:
				return 'D';
			case 3:
				return 'D#';
			case 4:
				return 'E';
			case 5:
				return 'F';
			case 6:
				return 'F#';
			case 7:
				return 'G';
			case 8:
				return 'G#';
			case 9:
				return 'A';
			default:
				return null;
		}
	}
}
