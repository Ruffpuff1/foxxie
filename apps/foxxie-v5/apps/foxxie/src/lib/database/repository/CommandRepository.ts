import { CommandEntity } from '../entities';
import { EntityRepository, FindOneOptions, Repository } from 'typeorm';

@EntityRepository(CommandEntity)
export class CommandRepository extends Repository<CommandEntity> {
    public async ensure(id: string, options?: FindOneOptions<CommandEntity>): Promise<CommandEntity> {
        const previous = await this.findOne({ id, ...options });
        if (previous) return previous;

        const entity = new CommandEntity();
        entity.id = id;
        return entity;
    }
}
