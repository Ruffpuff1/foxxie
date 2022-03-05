import { EventArgs, Events } from '#lib/types';
import { xpNeeded } from '#utils/util';
import { isDev, random } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions({
    event: Events.PointsMember,
    enabled: !isDev()
})
export class UserListener extends Listener<Events.PointsMember> {
    public async run(...[msg]: EventArgs<Events.PointsMember>): Promise<void> {
        const entity = await this.container.db.members.ensure(msg.author.id, msg.guild.id);

        const increment = random(4, 9);
        const newPoints = entity.points + increment;
        const newLevel = entity.level + 1;
        const points = xpNeeded(newLevel);

        if (newPoints >= points) {
            entity.points = newPoints - points;
            entity.level = newLevel;
            await entity.save();

            this.container.client.emit(Events.PointsReward, msg, newLevel);
        } else {
            entity.points = newPoints;
            await entity.save();
        }
    }
}
