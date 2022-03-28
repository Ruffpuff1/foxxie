import { seconds } from '@ruffpuff/utilities';
import { join } from 'node:path/win32';
import { stringify } from 'node:querystring';
import { request } from 'undici';
import type { HttpMethodEnum } from './types';

/**
 * Represents an HTTP request.
 */
export class Request {
    /**
     * The url for the request.
     */
    public url: URL;

    /**
     * The http method for the request can be any {@link HttpMethod}
     */
    public httpMethod: `${HttpMethodEnum}`;

    /**
     * The data to send with the request.
     */
    public data: any;

    /**
     * What to send the data as, defaults to Application/Json
     */
    public sendDataAs: 'json' | 'form' | 'buffer' | string | null;

    /**
     * An object of headers that will be included in the request.
     */
    public reqHeaders: Record<string, string>;

    /**
     * Whether stream is enabled.
     */
    public streamEnabled: boolean;

    /**
     * Whether compression is enabled.
     */
    public compressionEnabled: boolean;

    /**
     * The user agent of the request.
     */
    public ua: string;

    /**
     * Core options to include with the request.
     */
    public coreOptions: Record<string, unknown>;

    /**
     * The amount of miliseconds to wait before timing out the request.
     */
    public timeoutDuration: number;

    /**
     * The amount of redirects to follow the request for.
     */
    public redirects: number;

    /**
     * Creates a new request.
     * @param url The url for the request.
     * @param method The http method for the request, defaults to GET.
     */
    public constructor(url: string | URL, method?: `${HttpMethodEnum}`) {
        this.url = typeof url === 'string' ? new URL(url) : url;

        this.httpMethod = method ?? 'GET';

        this.data = null;

        this.sendDataAs = null;

        this.reqHeaders = {};

        this.streamEnabled = false;

        this.compressionEnabled = false;
        this.ua = `@foxxie/fetch/0.0.1`;

        this.coreOptions = {};

        this.timeoutDuration = seconds(30);

        this.redirects = 20;
    }

    /**
     * Add a query string parameter to the request url. Can be a single string value pair or an object with multiple.
     */
    public query(obj: Record<string, any>): this;
    public query(key: string, value: string): this;
    public query(key: string | Record<string, any>, value?: string): this {
        if (typeof key === 'object') {
            Object.keys(key).forEach(k => {
                this.url.searchParams.append(k, key[k]);
            });
        } else {
            this.url.searchParams.append(key, value!);
        }

        return this;
    }

    /**
     * Adds paths to the url string.
     * @param paths The paths to add to the query string.
     */
    public path(...paths: string[]): this {
        for (const path of paths) {
            this.url.pathname = join(this.url.pathname, path);
        }

        return this;
    }

    /**
     * Sends a body of data with the request.
     * @param data The data to send.
     * @param sendAs How to send the data.
     * @returns this
     */
    public body(data: any, sendAs?: string): this {
        this.sendDataAs = typeof data === 'object' && !sendAs && !Buffer.isBuffer(data) ? 'json' : sendAs ? sendAs.toLowerCase() : 'buffer';
        this.data = this.sendDataAs === 'form' ? stringify(data) : this.sendDataAs === 'json' ? JSON.stringify(data) : data;

        return this;
    }

    public timeout(timeout: number): this {
        this.timeoutDuration = timeout;
        return this;
    }

    public agent(...parts: string[]): this {
        this.ua = parts.join(' ');
        return this;
    }

    public header(obj: Record<string, any>): this;
    public header(key: string, value: string): this;
    public header(key: string | Record<string, any>, value?: string): this {
        if (typeof key === 'object') {
            Object.keys(key).forEach(k => {
                this.reqHeaders[k.toLowerCase()] = key[k];
            });
        } else {
            this.reqHeaders[key.toLowerCase()] = value!;
        }

        return this;
    }

    public options(obj: Record<string, any>): this;
    public options(key: string, value: string): this;
    public options(key: string | Record<string, any>, value?: string): this {
        if (typeof key === 'object') {
            Object.keys(key).forEach(k => {
                this.coreOptions[k] = key[k];
            });
        } else {
            this.coreOptions[key] = value;
        }

        return this;
    }

    public auth(token: string, type = 'Bearer'): this {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.reqHeaders['authorization'] = `${type} ${token}`;
        return this;
    }

    public follow(value: number | boolean) {
        if (typeof value === 'number') {
            this.redirects = value;
        } else if (value) {
            this.redirects = 20;
        } else {
            this.redirects = 0;
        }

        return this;
    }

    public method(method: `${HttpMethodEnum}`): this {
        this.httpMethod = method;
        return this;
    }

    public get(): this {
        return this.method('GET');
    }

    public post(): this {
        return this.method('POST');
    }

    public patch(): this {
        return this.method('PATCH');
    }

    public put(): this {
        return this.method('PUT');
    }

    public delete(): this {
        return this.method('DELETE');
    }

    public json<T = unknown>(): Promise<T> {
        return this.send().then(res => res.body.json()) as Promise<T>;
    }

    public raw(): Promise<Buffer> {
        return this.send().then(res => res.body.arrayBuffer().then(res => Buffer.from(res)));
    }

    public text(): Promise<string> {
        return this.send().then(res => res.body.text());
    }

    public send() {
        if (this.data) {
            if (!Reflect.has(this.reqHeaders, 'content-type')) {
                if (this.sendDataAs === 'json') this.reqHeaders['content-type'] = 'application/json';
                else if (this.sendDataAs === 'form') this.reqHeaders['content-type'] = 'application/x-www-form-urlencoded';
            }
        }

        this.header('User-Agent', this.ua);

        const options = {
            body: this.data,
            method: this.httpMethod,
            headers: this.reqHeaders,
            bodyTimeout: this.timeoutDuration,
            maxRedirections: this.redirects,
            ...this.coreOptions
        };

        const req = request(this.url, options);

        return req;
    }
}
