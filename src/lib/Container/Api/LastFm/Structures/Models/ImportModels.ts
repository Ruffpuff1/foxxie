export class SpotifyEndSongImportModel {
    public ts: string;

    public msPlayed: number;

    public masterMetadataTrackName: string;

    public masterMetadataAlbumArtistName: string;

    public masterMetadataAlbumName: string;

    public constructor(data: Partial<SpotifyEndSongImportModel>) {
        Object.assign(this, data);
    }
}
