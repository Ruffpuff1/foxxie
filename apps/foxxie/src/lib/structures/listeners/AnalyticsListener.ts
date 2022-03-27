import { EnvParse } from '@foxxie/env';
import type { Point } from '@influxdata/influxdb-client';
import { fromAsync, isErr, Listener } from '@sapphire/framework';
import { blueBright } from 'colorette';
import type { ClientEvents } from 'discord.js';

export abstract class AnalyticsListener<T extends keyof ClientEvents | symbol = ''> extends Listener<T> {
    public constructor(context: Listener.Context, options: AnalyticsListener.Options) {
        super(context, {
            ...options,
            enabled: EnvParse.boolean('INFLUX_ENABLED')
        });
    }

    public header = blueBright('Analytics:');

    public async run(...args: T extends keyof ClientEvents ? ClientEvents[T] : unknown[]) {
        const result = await fromAsync(this.handle(...args));
        if (isErr(result)) {
            this.container.logger.fatal(result.error);
        }
    }

    public write(point: Point | Point[]) {
        this.container.analytics!.writeApi.writePoints(Array.isArray(point) ? point : [point]);
    }

    protected abstract handle(...args: T extends keyof ClientEvents ? ClientEvents[T] : unknown[]): Promise<unknown> | unknown;
}

// eslint-disable-next-line no-redeclare
export namespace AnalyticsListener {
    export type Options = Listener.Options;
}
