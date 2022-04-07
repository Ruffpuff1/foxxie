import 'module-alias/register';
import './config';
import { isOnServer } from './lib/util';
import * as sentry from '@sentry/node';
import FoxxieClient from './lib/FoxxieClient';
import { container } from '@sapphire/framework';
import { config } from './lib/database';

async function main() {
    container.sentry = sentry;

    if (isOnServer()) {
        sentry.init({
            dsn: process.env.SENTRY_TOKEN,
            release: `Foxxie@${process.env.CLIENT_VERSION}`
        });
    }

    await config();

    const client = new FoxxieClient(isOnServer() ? sentry : null);
    client._login({ shardCount: client.options.shardCount ?? 1 });
}

main();