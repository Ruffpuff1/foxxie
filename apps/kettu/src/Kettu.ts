import { clientOptions } from '#root/config';
import { SapphireClient } from '@sapphire/framework';

async function main() {
    const client = new SapphireClient(clientOptions);
    await client.login();
}

void main();
