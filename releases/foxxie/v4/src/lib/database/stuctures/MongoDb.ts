import type { Connection, Repository, FindOneOptions } from 'typeorm';
import { GuildEntity, ModerationEntity, NoteEntity, ScheduleEntity, StarEntity, WarningEntity } from '../entities';
import { MemberRepository } from '../repository/MemberRepository';
import { ClientRepository } from '../repository/ClientRepository';
import type { Message } from 'discord.js';
import { BrandingColors } from 'lib/util';

export class MongoDb {

    public readonly connection: Connection;
    public readonly clients: ClientRepository;
    public readonly guilds: Repository<GuildEntity>;
    public readonly members: MemberRepository;
    public readonly moderations: Repository<ModerationEntity>;
    public readonly notes: Repository<NoteEntity>;
    public readonly schedules: Repository<ScheduleEntity>;
    public readonly starboards: Repository<StarEntity>;
    public readonly warnings: Repository<WarningEntity>;

    constructor(connection: Connection) {
        this.connection = connection;
        this.clients = connection.getCustomRepository(ClientRepository);
        this.guilds = connection.getRepository(GuildEntity);
        this.members = connection.getCustomRepository(MemberRepository);
        this.moderations = connection.getRepository(ModerationEntity);
        this.notes = connection.getRepository(NoteEntity);
        this.schedules = connection.getRepository(ScheduleEntity);
        this.starboards = connection.getRepository(StarEntity);
        this.warnings = connection.getRepository(WarningEntity);
    }

    public async fetchColor(msg: Message): Promise<number> {
        return msg.guild?.me?.displayColor || msg.member?.displayColor || BrandingColors.Primary;
    }

    public async fetchModerationEntry(caseId: number, guildId: string): Promise<ModerationEntity | undefined> {
        return this.moderations.findOne({ caseId, guildId } as FindOneOptions<ModerationEntity>);
    }

}

export interface MongoDb {
    readonly connection: Connection;
    readonly clients: ClientRepository;
    readonly guilds: Repository<GuildEntity>;
    readonly members: MemberRepository;
    readonly moderations: Repository<ModerationEntity>;
    readonly notes: Repository<NoteEntity>;
    readonly schedules: Repository<ScheduleEntity>;
    readonly starboards: Repository<StarEntity>;
    readonly warnings: Repository<WarningEntity>;
}