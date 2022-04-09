import { clientOptions, initI18n } from '#root/config';
import { SapphireClient } from '@sapphire/framework';

async function main() {
    await initI18n();

    const client = new SapphireClient(clientOptions);
    await client.login();
}

void main();
