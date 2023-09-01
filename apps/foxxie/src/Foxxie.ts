import { initI18n } from './config';
import { config } from '#database/config';
import FoxxieClient from '#lib/FoxxieClient';
import '#lib/setup';
import { helpUsagePostProcessor } from '#utils/constants';
import { EnvParse } from '@foxxie/env';
import { container } from '@sapphire/framework';
import { init } from '@sentry/node';
import i18next from 'i18next';
import { EnvKeys } from '#lib/types/Env';

async function main() {
    await initI18n();

    try {
        const client = new FoxxieClient();

        i18next.use(helpUsagePostProcessor);

        if (EnvParse.boolean(EnvKeys.SentryEnabled)) {
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
