import type { FoxxieCommand } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { cast } from '@ruffpuff/utilities';
import { Listener } from '@sapphire/framework';

export class UserListener extends Listener<FoxxieEvents.ChatInputCommandFinish> {
    public run(...[interaction, command]: EventArgs<FoxxieEvents.ChatInputCommandFinish>): void {
        this.container.client.emit(FoxxieEvents.ChatInputCommandLogging, interaction, cast<FoxxieCommand>(command));
    }
}
