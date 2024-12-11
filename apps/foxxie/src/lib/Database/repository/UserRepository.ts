import { FindOneOptions } from 'typeorm';

import { UserEntity } from '../entities/UserEntity.js';
import { CustomRepository } from './CustomRepository.js';

export class UserRepository extends CustomRepository<UserEntity> {
	public async ensure(id: string, options?: FindOneOptions<UserEntity>): Promise<UserEntity> {
		const found = (await this.repository.findOne({ where: { id, ...options } })) ?? new UserEntity();
		found.id = id;

		return found;
	}
}
