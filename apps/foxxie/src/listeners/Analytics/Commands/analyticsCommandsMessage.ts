import { Point } from '@influxdata/influxdb-client';
import { ApplyOptions } from '@sapphire/decorators';
import { AnalyticsListener } from '#lib/structures';
import { Events, MessageCommandSuccessPayload } from '@sapphire/framework';
import { Action, Points, Tag } from '#lib/types';

@ApplyOptions<AnalyticsListener.Options>({
    event: Events.MessageCommandSuccess
})
export class UserListener extends AnalyticsListener<'messageCommandSuccess'> {
    public handle(payload: MessageCommandSuccessPayload) {
        const command = new Point(Points.Commands) //
            .tag(Tag.Action, Action.Addition) //
            .tag(Tag.Category, payload.command.category!) //
            .intField(payload.command.name, 1);

        this.container.logger.trace(`${this.header} Wrote message command stats`);

        this.write(command);
    }
}
