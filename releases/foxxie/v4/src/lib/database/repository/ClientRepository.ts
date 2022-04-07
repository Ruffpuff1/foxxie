import { ClientEntity } from '../entities/ClientEntity';
import { EntityRepository, FindOneOptions, Repository } from 'typeorm';

@EntityRepository(ClientEntity)
export class ClientRepository extends Repository<ClientEntity> {

    public async ensure(options?: FindOneOptions<ClientEntity>): Promise<ClientEntity> {
        return (await this.findOne({ id: process.env.CLIENT_ID, ...options })) ?? new ClientEntity();
    }

}