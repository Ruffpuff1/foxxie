import type { MemberEntity } from '#lib/database';
import { Action, Events, Field, Points, Tag } from '#lib/types';
import { Point } from '@influxdata/influxdb-client';
import { ApplyOptions } from '@sapphire/decorators';
import { AnalyticsListener } from '#lib/structures';

@ApplyOptions<AnalyticsListener.Options>({ event: Events.AnalyticsPostStats })
export class UserListener extends AnalyticsListener<Events.AnalyticsPostStats> {
    public async handle() {
        const social = await this.getSocialStats();

        const point = new Point(Points.PointsCount).tag(Tag.Action, Action.Sync).intField(Field.Value, social.points);

        const repPoint = new Point(Points.RepCount).tag(Tag.Action, Action.Sync).intField(Field.Value, social.rep);

        const starPoint = new Point(Points.StarboardCount).tag(Tag.Action, Action.Sync).intField(Field.Value, social.stars);

        this.container.logger.trace(`${this.header} Wrote social stats`);

        this.write([point, repPoint, starPoint]);
    }

    private async getSocialStats() {
        const members = await this.container.db.members.find({
            where: {
                points: { $gt: 25 }
            },
            order: { messageCount: 'DESC' }
        });

        const users = await this.container.db.users.find({
            where: {
                points: { $gt: 25 }
            },
            order: { points: 'DESC' }
        });

        const combined = members.concat(users as unknown as MemberEntity);

        return {
            points: combined.reduce((acc, d) => (d.points += acc), 0),
            rep: users.reduce((acc, d) => (d.reputation += acc), 0),
            stars: await this.container.db.starboards.find().then(s => s.length)
        };
    }
}
