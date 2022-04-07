import { events, floatPromise } from '../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { get } from '@sapphire/plugin-editable-commands';

@ApplyOptions<ListenerOptions>({
    event: events.MESSAGE_DELETE_RESPONSE
})
export default class FoxxieListener extends Listener {

    public async run(msg: Message): Promise<void> {
        const response = get(msg);
        if (!response) return;
        await floatPromise(response.delete());
    }

}