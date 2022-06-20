import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('client', { schema: 'public' })
export class ClientEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn({ length: 19, default: process.env.CLIENT_ID })
    public id: string = process.env.CLIENT_ID!;

    @Column('varchar', { array: true, default: () => 'ARRAY[]::VARCHAR[]' })
    public guildBlocklist: string[] = [];

    @Column('varchar', { array: true, default: () => 'ARRAY[]::VARCHAR[]' })
    public userBlocklist: string[] = [];

    @Column('bigint', { default: 0 })
    public messageCount = 0;
}
