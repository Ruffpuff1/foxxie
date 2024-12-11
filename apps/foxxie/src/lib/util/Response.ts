export class Response<T> {
	public content: null | T = null;

	public message: null | string = null;

	public responseStatus?: Error;

	public success: boolean = false;

	public constructor(data?: Partial<Response<T>>) {
		Object.assign(this, data);
	}
}
