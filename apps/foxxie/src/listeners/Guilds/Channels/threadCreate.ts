import { EventArgs, FoxxieEvents } from '#lib/Types';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
    event: FoxxieEvents.ThreadCreate
})
export class UserListener extends Listener<FoxxieEvents.ThreadCreate> {
    public async run(...[thread, isNew]: EventArgs<FoxxieEvents.ThreadCreate>): Promise<void> {
        if (isNew) {
            await thread.join();
        }
    }
}
