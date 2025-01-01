export class Response<T> {
    public success: boolean;

    public responseStatus?: Error;

    public message: string;

    public content: T;

    public constructor(data?: Partial<Response<T>>) {
        Object.assign(this, data);
    }
}
