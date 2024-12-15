import { Action, Events, Field, Points, Tag } from '#lib/types';
import { Point } from '@influxdata/influxdb-client';
import { ApplyOptions } from '@sapphire/decorators';
import { AnalyticsListener } from '#lib/structures';

@ApplyOptions<AnalyticsListener.Options>({ event: Events.AnalyticsPostStats })
export class UserListener extends AnalyticsListener<Events.AnalyticsPostStats> {
    public async handle() {
        const rawData = await this.container.analytics!.fetchAnalytics();

        const point = new Point(Points.MessageCount) //
            .tag(Tag.Action, Action.Sync) //
            .intField(Field.Value, rawData.messageCount);

        const cmdPoint = new Point(Points.Commands) //
            .tag(Tag.Action, Action.Sync) //
            .intField(Field.Value, rawData.commandCount);

        this.container.logger.trace(`${this.header} Wrote message stats`);

        this.write([point, cmdPoint]);
    }
}
