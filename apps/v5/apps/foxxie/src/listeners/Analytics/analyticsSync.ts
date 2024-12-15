import { Action, EventArgs, Events, Field, Points, Tag } from '#lib/types';
import { Point } from '@influxdata/influxdb-client';
import { ApplyOptions } from '@sapphire/decorators';
import { AnalyticsListener } from '#lib/structures';

@ApplyOptions<AnalyticsListener.Options>({ event: Events.AnalyticsSync })
export class UserListener extends AnalyticsListener<Events.AnalyticsSync> {
    public async handle(...[guilds, users]: EventArgs<Events.AnalyticsSync>) {
        this.write([this.syncGuilds(guilds), this.syncUsers(users)]);

        this.container.logger.trace(`${this.header} Wrote user and guild stats`);
        this.container.client.emit(Events.AnalyticsPostStats);

        await this.container.analytics!.writeApi.flush();
    }

    private syncGuilds(value: number) {
        return new Point(Points.Guilds).tag(Tag.Action, Action.Sync).intField(Field.Value, value);
    }

    private syncUsers(value: number) {
        return new Point(Points.UserCount).tag(Tag.Action, Action.Sync).intField(Field.Value, value);
    }
}
