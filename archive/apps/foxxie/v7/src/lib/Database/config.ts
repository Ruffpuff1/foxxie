import { Track } from '#Api/LastFm/Structures/Entities/Track';
import { UserTrack } from '#Api/LastFm/Structures/Entities/UserTrack';
import { UserArtist } from '#Api/LastFm/Structures/UserArtist';
import { UserPlay } from '#Api/LastFm/Structures/Entities/UserPlay';
import { container } from '@sapphire/pieces';
import { join } from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { MongoDB } from './MongoDB';
import { ClientEntity, GuildEntity, MemberEntity } from './entities';
import { LastFmArtistEntity } from './entities/LastFmArtistEntity';
import { UserEntity } from './entities/UserEntity';
import { ClientRepository, GuildRepository, LastFmArtistRepository, MemberRepository } from './repository';
import { UserRepository } from './repository/UserRepository';

export async function config(): Promise<void> {
    const dataSource = new DataSource({
        type: 'mongodb',
        host: 'local',
        url: process.env.MONGO_URL,
        port: 3306,
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
        entities: [join(__dirname, 'entities/*Entity.js'), UserArtist, UserPlay, Track, UserTrack, GuildEntity],
        authSource: 'admin',
        ssl: true,
        logging: true
    });

    await dataSource.initialize();

    const clients = new ClientRepository(dataSource, ClientEntity);
    const guilds = new GuildRepository(dataSource, GuildEntity);
    const members = new MemberRepository(dataSource, MemberEntity);
    const lastFmArtists = new LastFmArtistRepository(dataSource, LastFmArtistEntity);
    const users = new UserRepository(dataSource, UserEntity);

    container.db = new MongoDB(dataSource, clients, guilds, members, lastFmArtists, users);
}
