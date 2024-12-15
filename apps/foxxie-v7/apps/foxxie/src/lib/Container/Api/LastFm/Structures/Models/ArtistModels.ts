import { ArtistInfo } from '../ArtistInfo';

export class ArtistSearch {
    public isRandom: boolean;

    public constructor(
        public artist: ArtistInfo | null,
        public response: string | null = null,
        public randomArtistPosition: number | null = null,
        public randomArtistPlaycount: number | null = null
    ) {
        this.isRandom = randomArtistPosition !== null && randomArtistPlaycount !== null;
    }
}
