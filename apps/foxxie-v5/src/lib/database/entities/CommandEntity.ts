import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { kBigIntTransformer } from '../transformers';

@Entity('command', { schema: 'public' })
export class CommandEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn()
    public id: string;

    @Column('bigint', { default: 0, transformer: kBigIntTransformer })
    public uses = 0;
}
