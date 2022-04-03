import { fetch } from '@foxxie/fetch';
import type { Api } from './types/types';
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const methods = ['get', 'post', 'delete', 'patch', 'put'];
const reflectors = ['toString', 'toJSON'];

function route() {
    const route = [''];
    const handler = {
        get(_: any, name: any): any {
            if (reflectors.includes(name)) return () => route.join('/');
            if (methods.includes(name)) {
                const routeBucket: string[] = [];
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < route.length; i++) {
                    routeBucket.push(route[i]);
                }

                switch (name) {
                    case 'get': {
                        return () =>
                            fetch('https://api.foxxie.xyz') //
                                .path(...route)
                                .get()
                                .json();
                    }
                    case 'post': {
                        return (options: Record<any, any>) =>
                            fetch('https://api.foxxie.xyz') //
                                .path(...route)
                                .body(options)
                                .post()
                                .json();
                    }
                    default: {
                        return (options: Record<any, any>) =>
                            fetch('https://api.foxxie.xyz') //
                                .path(...route)
                                .body(options)
                                .json();
                    }
                }
            }
            route.push(name);
            return new Proxy(noop, handler);
        },
        apply(_: unknown, __: unknown, args: any[]): any {
            // eslint-disable-next-line no-eq-null
            route.push(...args.filter(x => x != null));
            return new Proxy(noop, handler);
        }
    };
    return new Proxy(noop, handler);
}

export const api = () => route() as Api;
