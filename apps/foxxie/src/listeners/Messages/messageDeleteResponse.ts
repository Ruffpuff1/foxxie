import { EventArgs, FoxxieEvents } from '#lib/types';
import { floatPromise } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { get } from '@sapphire/plugin-editable-commands';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.MessageDelete
})
export class UserListener extends Listener<FoxxieEvents.MessageDelete> {
    public async run(...[msg]: EventArgs<FoxxieEvents.MessageDelete>): Promise<void> {
        const response = get(msg as Message);
        if (!response) return;

        await floatPromise(response.delete());
    }
}
