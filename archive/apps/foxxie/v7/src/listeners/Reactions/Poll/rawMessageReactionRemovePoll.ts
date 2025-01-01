import { LLRCData } from '#external/LongLivingReactionCollector';
import { EnvKeys } from '#lib/Types';
import { EnvParse } from '@foxxie/env';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({ event: 'rawReactionRemove', enabled: !isDev() })
export class UserListener extends Listener {
    public async run(data: LLRCData) {
        if (data.userId === EnvParse.string(EnvKeys.ClientId)) return;
        const { polls } = this.container.utilities.guild(data.guild);

        const entry = await polls.fetch(data.messageId);
        if (!entry) return;

        if (entry.ended) return;

        await entry.edit();
    }
}
