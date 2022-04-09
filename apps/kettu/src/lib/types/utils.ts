import type { ClientEvents } from 'discord.js';

export type EventArgs<T extends keyof ClientEvents> = ClientEvents[T];
