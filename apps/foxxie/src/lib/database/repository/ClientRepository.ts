import { FindOneOptions } from 'typeorm';

import { ClientEntity } from '../entities/ClientEntity.js';
import { CustomRepository } from './CustomRepository.js';

export class ClientRepository extends CustomRepository<ClientEntity> {
	public async ensure(options?: FindOneOptions<ClientEntity>): Promise<ClientEntity> {
		const found = (await this.repository.findOne({ where: { id: process.env.CLIENT_ID, ...options } })) ?? new ClientEntity();
		return found;
	}
}
