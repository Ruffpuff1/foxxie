import { maybeMe } from '#utils/Discord';
import { BrandingColors } from '#utils/constants';
import type { Message } from 'discord.js';
import type { DataSource, Repository } from 'typeorm';
import { GuildEntity, ModerationEntity, ScheduleEntity, StarEntity } from './entities';
import { ClientRepository, GuildRepository, MemberRepository } from './repository';
import { SerializerStore, TaskStore } from './structures';

export class MongoDB {
    public readonly dataSource: DataSource;

    public readonly clients: ClientRepository;

    public readonly guilds: GuildRepository<GuildEntity>;

    public readonly members: MemberRepository;

    public readonly moderations: Repository<ModerationEntity>;

    public readonly schedules: Repository<ScheduleEntity>;

    public readonly starboards: Repository<StarEntity>;

    public serializers = new SerializerStore();

    public tasks = new TaskStore();

    public constructor(
        dataSource: DataSource,
        clients: ClientRepository,
        guilds: GuildRepository<GuildEntity>,
        members: MemberRepository
    ) {
        this.dataSource = dataSource;
        this.clients = clients;
        this.guilds = guilds;
        this.members = members;
        this.moderations = dataSource.getRepository(ModerationEntity);
        this.schedules = dataSource.getRepository(ScheduleEntity);
        this.starboards = dataSource.getRepository(StarEntity);
    }

    public fetchColor(msg: Message): number {
        return msg.member?.displayColor || maybeMe(msg.guild!)?.displayColor || BrandingColors.Primary;
    }
}

// eslint-disable-next-line no-redeclare
export interface MongoDB {
    readonly dataSource: DataSource;
    readonly clients: ClientRepository;
    readonly guilds: GuildRepository<GuildEntity>;
    readonly members: MemberRepository;
    readonly moderation: ModerationEntity;
    readonly schedules: Repository<ScheduleEntity>;
    readonly starboards: Repository<StarEntity>;
}
