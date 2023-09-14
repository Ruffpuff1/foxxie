import { EventArgs, FoxxieEvents } from '#lib/Types';
import { floatPromise } from '#utils/util';
import { cast } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { get } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.MessageDelete
})
export class UserListener extends Listener<FoxxieEvents.MessageDelete> {
    public async run(...[msg]: EventArgs<FoxxieEvents.MessageDelete>): Promise<void> {
        const response = get(cast<Message>(msg));
        if (!response) return;

        await floatPromise(response.delete());
    }
}
