import { BaseEntity, DataSource, EntityTarget, FindOneOptions } from 'typeorm';

export abstract class CustomRepository<T extends BaseEntity> {
    protected dataSource: DataSource;

    protected entity: EntityTarget<T>;

    public constructor(dataSource: DataSource, entity: EntityTarget<T>) {
        this.dataSource = dataSource;

        this.entity = entity;
    }

    protected get repository() {
        return this.dataSource.getRepository(this.entity);
    }

    public findOne(options: FindOneOptions<T>) {
        return this.dataSource.getRepository(this.entity).findOne(options);
    }
}
