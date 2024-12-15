import { acquireSettings } from '#lib/database';
import { GuildMessage } from '#lib/types';
import { isThenable } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { cpus, hostname, loadavg, totalmem } from 'node:os';

/**
 * Attaches a logging catch method to a promise, "floating it".
 * @param promise The promise to float.
 */
export function floatPromise(promise: Promise<unknown>) {
    if (isThenable(promise))
        promise.catch((error: Error) => {
            container.logger.debug(error);
        });
    return promise;
}

export async function resolveKey(message: GuildMessage, key: string, ...variables: any[]): Promise<string> {
    const guild = await acquireSettings(message.guild.id);
    const result = guild.getLanguage()(key, { ...variables });

    return result;
}

export function getServerDetails() {
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
    const totalmemory = ((totalmem() / 1024 / 1024 / 1024) * 1024).toFixed(0);
    const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    return {
        totalmemory,
        memoryUsed,
        memoryPercent: ((parseInt(memoryUsed, 10) / parseInt(totalmemory, 10)) * 100).toFixed(1),
        process: hostname(),
        cpuCount: cpus().length,
        cpuUsage: (loadavg()[0] * 10).toFixed(1),
        cpuSpeed: (cpus()[0].speed / 1000).toFixed(1),
        uptime: Date.now() - container.client.uptime!,
        version: process.env.CLIENT_VERSION!,
        totalShards: container.client.options.shardCount || 1
    };
}
