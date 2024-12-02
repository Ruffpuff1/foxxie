import { AsyncQueue } from '@sapphire/async-queue';
import { ReadonlyGuildData } from '../types';
import { container } from '@sapphire/framework';
import { FoxxieGuild } from '#Database/Models';
import { GuildSettingsService } from '#lib/Container/Services/GuildSettingService';

export class Transaction {
    #changes = Object.create(null) as Partial<ReadonlyGuildData>;
    #hasChanges = false;
    #locking = true;

    public constructor(
        public readonly settings: FoxxieGuild,
        private readonly queue: AsyncQueue
    ) {}

    public get hasChanges() {
        return this.#hasChanges;
    }

    public get locking() {
        return this.#locking;
    }

    public write(data: Partial<ReadonlyGuildData>) {
        Object.assign(this.#changes, data);
        this.#hasChanges = true;
        return this;
    }

    public async submit() {
        if (!this.#hasChanges) {
            return;
        }

        try {
            if (GuildSettingsService.WeakMapNotInitialized.has(this.settings)) {
                await container.prisma.guilds.create({
                    // @ts-expect-error readonly
                    data: { ...this.settings, ...this.#changes }
                });
                GuildSettingsService.WeakMapNotInitialized.delete(this.settings);
            } else {
                await container.prisma.guilds.update({
                    where: { id: this.settings.id },
                    // @ts-expect-error readonly
                    data: this.#changes
                });
            }

            Object.assign(this.settings, this.#changes);
            this.#hasChanges = false;
            GuildSettingsService.UpdateSettingsContext(this.settings, this.#changes);
        } finally {
            this.#changes = Object.create(null);

            if (this.#locking) {
                this.queue.shift();
                this.#locking = false;
            }
        }
    }

    public abort() {
        if (this.#locking) {
            this.queue.shift();
            this.#locking = false;
        }
    }

    public dispose() {
        if (this.#locking) {
            this.queue.shift();
            this.#locking = false;
        }
    }

    public [Symbol.dispose]() {
        return this.dispose();
    }
}
