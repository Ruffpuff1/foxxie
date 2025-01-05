import { minutes } from "@ruffpuff/utilities";
import { container } from "@sapphire/pieces";
import { Collection } from "discord.js";

export class Leaderboard {
  public readonly global = new Collection<string, LeaderboardUser>();

  public readonly local = new Collection<
    string,
    Collection<string, LeaderboardUser>
  >();

  private readonly timeouts: LeaderboardTimeouts = {
    guilds: new Collection(),
    users: null,
  };

  private readonly promises: LeaderboardPromises = {
    guilds: new Collection(),
    users: null,
  };

  public async fetch(
    type: LeaderboardType,
    guild?: string
  ): Promise<Collection<string, LeaderboardUser>> {
    if (guild && type === LeaderboardType.Local) {
      if (this.promises.guilds.has(guild))
        await this.promises.guilds.get(guild);
      else if (!this.local.has(guild)) await this.syncMembers(guild);
      return this.local.get(guild)!;
    }

    return this.local.get(guild!)!;
  }

  private async syncMembers(guild: string): Promise<void> {
    if (this.timeouts.guilds.has(guild)) {
      clearTimeout(this.timeouts.guilds.get(guild)!);
    }

    const promise = new Promise<void>((resolve) =>
      this.createMemberSync(guild).then(resolve)
    );

    this.promises.guilds.set(guild, promise);
    await promise;

    const timeout = setTimeout(() => {
      this.timeouts.guilds.delete(guild);
      this.local.get(guild)?.clear();
      this.local.delete(guild);
    }, minutes(10));
    this.timeouts.guilds.set(guild, timeout);
  }

  private async createMemberSync(guild: string) {
    const { members } = container.db;
    const data = await members.find({
      where: {
        guildId: { $eq: guild },
        level: { $gt: 1 },
      },
      order: { level: "DESC" },
      take: 5000,
    });

    if (this.local.has(guild)) this.local.get(guild)!.clear();
    else this.local.set(guild, new Collection());

    const store = this.local.get(guild)!;
    let i = 0;
    for (const entry of data.filter((entry) => entry.member !== undefined)) {
      store.set(entry.id, {
        points: entry.points,
        position: ++i,
        level: entry.level,
      });
    }

    this.promises.guilds.delete(guild);
  }
}

export enum LeaderboardType {
  Local,
  Global,
}

export interface LeaderboardUser {
  points: number;
  position: number;
  level: number;
}

interface LeaderboardTimeouts {
  users: NodeJS.Timeout | null;
  guilds: Collection<string, NodeJS.Timeout>;
}

interface LeaderboardPromises {
  users: Promise<void> | null;
  guilds: Collection<string, Promise<void>>;
}
