import { EventArgs, Events } from '#lib/types';
import { floatPromise } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { get } from '@sapphire/plugin-editable-commands';

@ApplyOptions<ListenerOptions>({
    event: Events.MessageDeleteResponse
})
export class UserListener extends Listener<Events.MessageDeleteResponse> {
    public async run(...[msg]: EventArgs<Events.MessageDeleteResponse>): Promise<void> {
        const response = get(msg as Message);
        if (!response) return;

        await floatPromise(response.delete());
    }
}
