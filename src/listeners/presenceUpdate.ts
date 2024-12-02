import { FoxxieEvents } from '#lib/Types/Events';
import { EventArgs } from '#lib/Types/Utils';
import { floatPromise } from '#lib/util/util';
import { EnvParse } from '@foxxie/env';
import { Listener } from '@sapphire/framework';
import { ActivityType, PresenceStatusData, PresenceUpdateStatus } from 'discord.js';

export class UserListener extends Listener {
    private cache = new Set<string>();

    public async run(...[_, presence]: EventArgs<FoxxieEvents.PresenceUpdate>) {
        if (presence.userId === '825130284382289920') {
            if (presence.status === PresenceUpdateStatus.Offline) {
                if (this.cache.has(presence.userId)) return;
                console.log(presence);
                this.cache.add(presence.userId);
                this.container.client.developmentRecoveryMode = true;
                this.reloadStores();
                this.setStatus('idle');
            } else {
                if (this.cache.has(presence.userId)) return;
                console.log(presence);
                this.cache.add(presence.userId);

                this.container.client.developmentRecoveryMode = false;
                await this.reloadStores();
                this.setStatus('invisible');
            }
        }
    }

    private reloadStores() {
        return this.container.stores.map(store => store.loadAll());
    }

    private async setStatus(status: PresenceStatusData) {
        await floatPromise(this.container.client.users.fetch(process.env.CLIENT_ID!));
        return this.container.client.user?.setPresence({
            activities: [
                {
                    name: EnvParse.string('CLIENT_PRESENCE_NAME'),
                    type: ActivityType.Playing
                }
            ],
            status
        });
    }
}
