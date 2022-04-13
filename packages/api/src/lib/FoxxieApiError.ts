export class FoxxieApiError extends Error {
    public code: number;

    public message: string;

    public error!: string;

    public path!: string;

    public constructor(data: { code: number; message?: string; error: string; path: string }) {
        super();
        this.code = data.code;
        this.message = data.message || data.error;
        this.error = data.error;
        this.path = data.path;
    }
}
