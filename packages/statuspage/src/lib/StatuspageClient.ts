import { fetch } from '@foxxie/fetch';
import { hours, minutes } from '@ruffpuff/utilities';
import type { StatusPage } from '../types';

export class StatuspageClient {
    public url = 'https://discordstatus.com';

    public async incidents() {
        try {
            const result = await fetch(this.url) //
                .path('api')
                .path('v2')
                .path('incidents.json')
                .json<StatusPage.IncidentsResult>();

            const { incidents } = result;
            if (!incidents.length) return [];

            const sorted = this.checkIncidents(incidents);
            return sorted;
        } catch {
            return [];
        }
    }

    public async status() {
        try {
            const result = await fetch(this.url) //
                .path('api')
                .path('v2')
                .path('status.json')
                .json<StatusPage.StatusResult>();

            return result;
        } catch {
            return null;
        }
    }

    private checkIncidents(incidents: StatusPage.Incident[]): StatusPage.Incident[] {
        const sorted: StatusPage.Incident[] = [];
        for (const incident of incidents) {
            // if the incident is older than 36 hours, skip.
            if (new Date(incident.created_at).getTime() + hours(36) <= Date.now()) continue;
            // if last update was greater than five minutes ago, no use in repeating.
            if (Date.now() - new Date(incident.updated_at!).getTime() > minutes(5)) continue;

            sorted.push(incident);
        }

        return sorted;
    }
}
