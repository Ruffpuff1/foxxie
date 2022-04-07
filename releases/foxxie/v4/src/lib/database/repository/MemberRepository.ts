import { MemberEntity } from '../entities';
import { EntityRepository, FindOneOptions, Repository } from 'typeorm';

@EntityRepository(MemberEntity)
export class MemberRepository extends Repository<MemberEntity> {

    public async ensure(id: string, guildId: string, options: FindOneOptions<MemberEntity> = {}): Promise<MemberEntity> {
        const previous = await this.findOne({ id, guildId, ...options });
        if (previous) return previous;

        const data = new MemberEntity();
        data.id = id;
        data.guildId = guildId;
        return data;
    }

}