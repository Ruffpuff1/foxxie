export class Response<T> {
	public success: boolean = false;

	public responseStatus?: Error;

	public message: string | null = null;

	public content: T | null = null;

	public constructor(data?: Partial<Response<T>>) {
		Object.assign(this, data);
	}
}
