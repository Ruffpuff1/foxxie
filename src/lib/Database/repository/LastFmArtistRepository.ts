import { Collection } from 'discord.js';
import { LastFmArtistEntity } from '../entities/LastFmArtistEntity';
import { CustomRepository } from './CustomRepository';

export class LastFmArtistRepository extends CustomRepository<LastFmArtistEntity> {
    public cache = new Collection<string, LastFmArtistEntity>();

    public async getArtist(name: string): Promise<LastFmArtistEntity | null> {
        const found = this.cache.get(name) || (await this.repository.findOne({ where: { name } }));
        return found;
    }
}
