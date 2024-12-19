import { FindOneOptions } from 'typeorm';

import { MemberEntity } from '../entities/MemberEntity.js';
import { CustomRepository } from './CustomRepository.js';

export class MemberRepository extends CustomRepository<MemberEntity> {
	public async ensure(id: string, guildId: string, options: FindOneOptions<MemberEntity> = {}): Promise<MemberEntity> {
		const previous = await this.findOne({ where: { guildId, id, ...options } });
		if (previous) return previous;

		const data = new MemberEntity();
		data.id = id;
		data.guildId = guildId;
		return data;
	}

	public async guild(guildId: string) {
		return this.dataSource.getRepository(this.entity).find({
			where: {
				guildId
			}
		});
	}
}
