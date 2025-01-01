import { AnalyticsListener } from '#lib/structures';
import { Action, Points, Tag } from '#lib/types';
import { Point } from '@influxdata/influxdb-client';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, ChatInputCommandSuccessPayload } from '@sapphire/framework';

@ApplyOptions<AnalyticsListener.Options>({
    event: Events.ChatInputCommandSuccess
})
export class UserListener extends AnalyticsListener<'chatInputCommandSuccess'> {
    public handle(payload: ChatInputCommandSuccessPayload) {
        const command = new Point(Points.Commands) //
            .tag(Tag.Action, Action.Addition) //
            .tag(Tag.Category, payload.command.category!) //
            .intField(payload.command.name, 1);

        this.container.logger.trace(`${this.header} Wrote chat input command stats.`);

        this.write(command);
    }
}
