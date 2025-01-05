import { container } from "@sapphire/pieces";
import { Collection } from "discord.js";
import { isNullish } from "@sapphire/utilities";
import type { FoxxieQueue } from "./FoxxieQueue";
import { Queue } from "./Queue";
import type { RedisManager } from "#lib/structures";

export class QueueManager extends Collection<string, Queue> {
  public redis: RedisManager;

  public constructor(public readonly client: FoxxieQueue) {
    super();

    this.redis = container.redis!;
  }

  public get(key: string): Queue {
    let queue = super.get(key);
    if (!queue) {
      queue = new Queue(this, key);
      this.set(key, queue);
    }
    return queue;
  }

  public async start() {
    for (const guild of container.client.guilds.cache.values()) {
      const { channelId } = guild.me!.voice;
      if (isNullish(channelId)) continue;

      await this.get(guild.id).player.join(channelId, { deaf: true });
    }
  }
}
