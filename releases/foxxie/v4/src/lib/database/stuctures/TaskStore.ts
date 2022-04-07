import { Store } from '@sapphire/framework';
import { Task } from './Task';

export class TaskStore extends Store<Task> {

    public constructor() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(Task as any, { name: 'tasks' });
        this.container.client.stores.register(this);
    }

}