import { config } from '#Database/config';
import FoxxieClient from '#lib/FoxxieClient';
import '#lib/Setup';
import { EnvKeys } from '#lib/Types';
import { helpUsagePostProcessor } from '#utils/constants';
import { EnvParse } from '@foxxie/env';
import { container } from '@sapphire/framework';
import { init } from '@sentry/node';
import i18next from 'i18next';

async function main() {
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
