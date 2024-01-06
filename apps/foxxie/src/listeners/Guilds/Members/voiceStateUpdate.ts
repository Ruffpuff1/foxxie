import { EventArgs, FoxxieEvents } from '#lib/Types';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
    event: FoxxieEvents.VoiceStateUpdate
})
export class UserListener extends Listener<FoxxieEvents.VoiceStateUpdate> {
    public run(...[old, state]: EventArgs<FoxxieEvents.VoiceStateUpdate>): void {
        if (old.channelId === null && state.channelId !== null) {
            this.container.client.emit(FoxxieEvents.VoiceChannelJoin, state);
        }

        if (old.channelId !== null && state.channelId === null) {
            this.container.client.emit(FoxxieEvents.VoiceChannelLeave, state);
        }

        if (old.selfDeaf === false && state.selfDeaf === true) {
            this.container.client.emit(FoxxieEvents.VoiceChannelDeafened, state);
        }

        if (old.selfDeaf === true && state.selfDeaf === false) {
            this.container.client.emit(FoxxieEvents.VoiceChannelUndeafened, state);
        }

        if (old.selfMute === false && state.selfMute === true) {
            this.container.client.emit(FoxxieEvents.VoiceChannelMuted);
        }

        if (old.selfMute === true && state.selfMute === false) {
            this.container.client.emit(FoxxieEvents.VoiceChannelUnmuted);
        }
    }
}
