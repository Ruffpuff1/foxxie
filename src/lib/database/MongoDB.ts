import type { Connection, Repository } from 'typeorm';
import { GuildEntity, ModerationEntity, ScheduleEntity, StarEntity } from './entities';
import { ClientRepository, MemberRepository, GuildRepository } from './repository';
import type { Message } from 'discord.js';
import { BrandingColors } from '#utils/constants';
import { SerializerStore, TaskStore } from './structures';

export class MongoDB {
    public readonly connection: Connection;

    public readonly clients: ClientRepository;

    public readonly guilds: GuildRepository<GuildEntity>;

    public readonly members: MemberRepository;

    public readonly moderations: Repository<ModerationEntity>;

    public readonly schedules: Repository<ScheduleEntity>;

    public readonly starboards: Repository<StarEntity>;

    public serializers = new SerializerStore();

    public tasks = new TaskStore();

    public constructor(connection: Connection) {
        this.connection = connection;
        this.clients = connection.getCustomRepository(ClientRepository);
        this.guilds = connection.getCustomRepository(GuildRepository);
        this.members = connection.getCustomRepository(MemberRepository);
        this.moderations = connection.getRepository(ModerationEntity);
        this.schedules = connection.getRepository(ScheduleEntity);
        this.starboards = connection.getRepository(StarEntity);
    }

    public fetchColor(msg: Message): number {
        return msg.guild?.me?.displayColor || msg.member?.displayColor || BrandingColors.Primary;
    }
}

// eslint-disable-next-line no-redeclare
export interface MongoDB {
    readonly connection: Connection;
    readonly clients: ClientRepository;
    readonly guilds: GuildRepository<GuildEntity>;
    readonly members: MemberRepository;
    readonly moderation: ModerationEntity;
    readonly schedules: Repository<ScheduleEntity>;
    readonly starboards: Repository<StarEntity>;
}
