import { Action, Events, Field, Points, Tag } from '#lib/types';
import { Point } from '@influxdata/influxdb-client';
import { ApplyOptions } from '@sapphire/decorators';
import { AnalyticsListener } from '#lib/structures';

@ApplyOptions<AnalyticsListener.Options>({ event: Events.AnalyticsPostStats })
export class UserListener extends AnalyticsListener<Events.AnalyticsPostStats> {
    public async handle() {
        const point = new Point(Points.SongCount) //
            .tag(Tag.Action, Action.Sync) //
            .intField(Field.Value, await this.container.analytics!.fetchAnalytics().then(res => res.songCount));

        this.container.logger.trace(`${this.header} Wrote song stats`);

        this.write(point);
    }
}
