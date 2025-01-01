import { ApplyOptions } from '@sapphire/decorators';
import { AudioListener } from '#lib/structures';
import { magenta } from 'colorette';

@ApplyOptions<AudioListener.Options>({ emitter: 'audio', event: 'open' })
export class UserListener extends AudioListener {
	private readonly kHeader = magenta('[LAVALINK]');

	public run() {
		this.container.logger.trace(`${this.kHeader} Connected.`);
	}
}
