import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('background', { schema: 'public' })
export class BackgroundEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn('varchar')
    public id!: string;

    @Column('boolean', { default: true })
    public enabled = true;

    @Column('varchar', { length: 128 })
    public title!: string;

    @Column('varchar', { length: 19 })
    public authorId!: string;

    @Column('integer')
    public price!: number;
}
