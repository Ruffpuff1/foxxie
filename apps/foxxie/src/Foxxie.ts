import { config } from '#database/config';
import FoxxieClient from '#lib/FoxxieClient';
import '#lib/setup';
import { helpUsagePostProcessor } from '#utils/constants';
import { container } from '@sapphire/framework';
import { init } from '@sentry/node';
import i18next from 'i18next';
import { envParse } from './config';

async function main() {
    try {
        const client = new FoxxieClient();

        i18next.use(helpUsagePostProcessor);

        if (envParse.boolean('SENTRY_ENABLED')) {
            init({
                dsn: process.env.SENTRY_TOKEN,
                release: `Foxxie@${process.env.CLIENT_VERSION}`
            });
        }

        await config();

        await client.login();
    } catch (err) {
        container.logger.fatal(err);
    }
}

void main();
