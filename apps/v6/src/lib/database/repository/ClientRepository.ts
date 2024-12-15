import { EntityRepository, FindOneOptions, Repository } from 'typeorm';
import { ClientEntity } from '../entities';

@EntityRepository(ClientEntity)
export class ClientRepository extends Repository<ClientEntity> {
    public async ensure(options?: FindOneOptions<ClientEntity>): Promise<ClientEntity> {
        // eslint-disable-next-line @typescript-eslint/no-extra-parens
        const found = (await this.findOne({ id: process.env.CLIENT_ID, ...options })) ?? new ClientEntity();
        return found;
    }
}
