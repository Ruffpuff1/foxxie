import type { ClientAnalytics } from '#database/entities/ClientAnalytics';
import { EnvParse } from '@foxxie/env';
import { InfluxDB, WriteApi } from '@influxdata/influxdb-client';
import { container } from '@sapphire/framework';

export class AnalyticsManager {
    public influx: InfluxDB | null = EnvParse.boolean('INFLUX_ENABLED')
        ? new InfluxDB({
              url: process.env.INFLUX_URL!,
              token: process.env.INFLUX_TOKEN
          })
        : null;

    public writeApi!: WriteApi;

    public constructor() {
        this.writeApi = this.influx!.getWriteApi(process.env.INFLUX_ORG!, 'Analytics');
    }

    public fetchAnalytics(): Promise<ClientAnalytics> {
        return container.db.clients.ensure().then(client => client.analytics);
    }
}
