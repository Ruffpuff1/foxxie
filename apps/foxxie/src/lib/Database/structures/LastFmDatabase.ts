import { Track } from '#Api/LastFm/Structures/Entities/Track';
import { UserTrack } from '#Api/LastFm/Structures/Entities/UserTrack';
import { UserArtist } from '#Api/LastFm/Structures/UserArtist';
import { UserPlay } from '#Api/LastFm/Structures/Entities/UserPlay';
import { DataSource, MongoRepository } from 'typeorm';

export class LastFmDatabase {
    public tracks: MongoRepository<Track>;

    public userArtists: MongoRepository<UserArtist>;

    public userPlays: MongoRepository<UserPlay>;

    public userTracks: MongoRepository<UserTrack>;

    public constructor(datasource: DataSource) {
        this.tracks = datasource.getMongoRepository(Track);

        this.userArtists = datasource.getMongoRepository(UserArtist);

        this.userPlays = datasource.getMongoRepository(UserPlay);

        this.userTracks = datasource.getMongoRepository(UserTrack);
    }
}
