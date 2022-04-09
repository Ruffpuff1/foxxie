import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { container } from '@sapphire/framework';
import {
    GuildEntity,
    ClientEntity,
    MemberEntity,
    ModerationEntity,
    NoteEntity,
    WarningEntity,
    StarEntity,
    UserEntity,
    ScamEntity,
    CommandEntity,
    PlaylistEntity
} from './entities';
import { BackgroundEntity } from './entities/BackgroundEntity';
import { MongoDB } from './MongoDB';

export async function config(): Promise<void> {
    const connection = await createConnection({
        type: 'mongodb',
        host: 'local',
        url: process.env.MONGO_URL,
        port: 3306,
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
        entities: [
            BackgroundEntity,
            CommandEntity,
            ClientEntity,
            GuildEntity,
            MemberEntity,
            ModerationEntity,
            NoteEntity,
            PlaylistEntity,
            ScamEntity,
            StarEntity,
            UserEntity,
            WarningEntity
        ],
        authSource: 'admin',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        logging: true
    });

    container.db = new MongoDB(connection);
}
