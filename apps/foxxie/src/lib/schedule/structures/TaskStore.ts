import { Store } from '@sapphire/framework';
import { cast } from '@sapphire/utilities';
/**
 * @license Apache License 2.0
 * @copyright 2019 Skyra Project
 */
import { Task } from '#lib/schedule';

export class TaskStore extends Store<Task> {
	/**
	 * Constructs our TaskStore for use in Foxxie
	 * @param client The client that instantiates this store
	 */
	public constructor() {
		super(cast<any>(Task), { name: 'tasks' });
		this.container.client.stores.register(this);
	}
}
