import { FindOneOptions } from 'typeorm';
import { CustomRepository } from './CustomRepository.js';
import { UserEntity } from '../entities/UserEntity.js';

export class UserRepository extends CustomRepository<UserEntity> {
	public async ensure(id: string, options?: FindOneOptions<UserEntity>): Promise<UserEntity> {
		// eslint-disable-next-line @typescript-eslint/no-extra-parens
		const found = (await this.repository.findOne({ where: { id, ...options } })) ?? new UserEntity();
		found.id = id;

		return found;
	}
}
