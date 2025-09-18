import { PlaySource, ResponseStatus } from '../Types/index.js';

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
