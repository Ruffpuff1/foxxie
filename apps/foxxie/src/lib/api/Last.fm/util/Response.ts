import { PlaySource } from '../types/enums/PlaySource.js';
import { ResponseStatus } from '../types/ResponseStatus.js';

export class Response<T> {
	public content!: T;

	public error?: ResponseStatus;

	public message!: string;

	public playSources?: PlaySource[];

	public success!: boolean;

	public constructor(data?: Partial<Response<T>>) {
		Object.assign(this, data);
	}
}
