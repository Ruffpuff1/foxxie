import { EntityRepository, FindOneOptions, Repository } from 'typeorm';
import { UserProfile, UserCooldown, UserCooldownReputation } from '../entities';
import { UserEntity } from '../entities/UserEntity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    public async ensure(id: string, options: FindOneOptions<UserEntity> = {}): Promise<UserEntity> {
        const previous = await this.findOne({ id, ...options });
        if (previous?.cooldown && !previous.cooldown.reputation) previous.cooldown.reputation = new UserCooldownReputation();
        if (previous) return previous;

        const data = new UserEntity();
        data.id = id;

        if (data.cooldown && !data.cooldown.reputation) data.cooldown.reputation = new UserCooldownReputation();

        return data;
    }

    public async ensureProfile(id: string, options: FindOneOptions<UserEntity> = {}): Promise<UserEntity & { profile: UserProfile }> {
        const user = await this.ensure(id, options);
        if (!user.profile) {
            user.profile = new UserProfile();
            user.profile.userId = user.id;
        }

        if (user.cooldown && !user.cooldown.reputation) user.cooldown.reputation = new UserCooldownReputation();

        return user as UserEntity & { profile: UserProfile };
    }

    public async ensureCooldown(
        id: string,
        options: FindOneOptions<UserEntity> = {}
    ): Promise<UserEntity & { cooldown: UserCooldown & { reputation: UserCooldownReputation } }> {
        const user = await this.ensure(id, options);
        if (!user.cooldown) {
            user.cooldown = new UserCooldown();
            user.cooldown.userId = user.id;
        }

        if (user.cooldown && !user.cooldown.reputation) user.cooldown.reputation = new UserCooldownReputation();

        return user as UserEntity & { cooldown: UserCooldown & { reputation: UserCooldownReputation } };
    }

    public async ensureProfileAndCooldown(
        id: string,
        options: FindOneOptions<UserEntity> = {}
    ): Promise<UserEntity & { cooldown: UserCooldown & { reputation: UserCooldownReputation }; profile: UserProfile }> {
        const user = await this.ensure(id, options);
        if (!user.profile) {
            user.profile = new UserProfile();
            user.profile.userId = user.id;
        }

        if (!user.cooldown) {
            user.cooldown = new UserCooldown();
            user.cooldown.userId = user.id;
        }

        if (user.cooldown && !user.cooldown.reputation) user.cooldown.reputation = new UserCooldownReputation();

        return user as UserEntity & { cooldown: UserCooldown & { reputation: UserCooldownReputation }; profile: UserProfile };
    }
}
