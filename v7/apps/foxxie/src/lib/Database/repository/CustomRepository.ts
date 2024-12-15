import { BaseEntity, DataSource, DeepPartial, EntityTarget, FilterOperators, FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class CustomRepository<T extends DeepPartial<BaseEntity>> {
    protected dataSource: DataSource;

    protected entity: EntityTarget<T>;

    public constructor(dataSource: DataSource, entity: EntityTarget<T>) {
        this.dataSource = dataSource;

        this.entity = entity;
    }

    public findOne(options: FindOneOptions<T>) {
        return this.dataSource.getRepository(this.entity).findOne(options);
    }

    public findMany(options?: FindManyOptions<T> | Partial<T> | FilterOperators<T>) {
        return this.dataSource.getMongoRepository(this.entity).find(options);
    }

    public get repository() {
        return this.dataSource.getMongoRepository(this.entity);
    }
}
