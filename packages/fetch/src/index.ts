import { HttpMethod, Request } from './Request';

/**
 * Fetch a link using undici
 * @param url The url to fetch
 * @param method The method to fetch with, defaults to GET.
 * @returns Request The {@link Request} class.
 */
export const fetch = (url: string | URL, method?: HttpMethod) => new Request(url, method);
export { HttpMethodEnum, HttpMethod } from './Request';
