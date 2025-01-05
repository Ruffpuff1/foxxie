import { container } from "@sapphire/pieces";
import type { HexColorString, User } from "discord.js";
import type FoxxieClient from "lib/FoxxieClient";
import { Column } from "typeorm";

export class UserProfile {
  /**
   * The Id of the user of whom the profile belongs to.
   */
  @Column("varchar", { length: 19 })
  public userId?: string;

  /**
   * The timezone set for the user.
   * @default null
   */
  @Column("varchar", { nullable: true })
  public timezone: string = null!;

  /**
   * The background to use for a users leveling icon.
   * @default null
   */
  @Column("varchar", { nullable: true })
  public background: string = null!;

  /**
   * The owned profile backgrounds.
   */
  @Column("varchar", { array: true, default: () => "ARRAY[]::VARCHAR[]" })
  public ownedBackgrounds: string[] = [];

  /**
   * The color of the users profile.
   * @default 0
   */
  @Column("integer", { default: 0 })
  public color = 0x000000;

  @Column("varchar", { nullable: true, length: 140 })
  public bio: string = null!;

  /**
   * Whether darkmode is enabled in the user's profile.
   * @default true
   */
  @Column("boolean", { default: true })
  public darkmode = true;

  /**
   * Roleplay statistics for a user.
   * @default {}
   */
  @Column()
  public roleplay: RoleplayData = {};

  /**
   * The Client that manages the user.
   */
  public get client(): FoxxieClient {
    return container.client as FoxxieClient;
  }

  /**
   * The user of whom this profile belongs to.
   */
  public get user(): User | null {
    return this.client.users.resolve(this.userId!) ?? null;
  }

  /**
   * This profiles color represented as a hexidecimal string.
   */
  public get hexColor(): HexColorString {
    return `#${this.color.toString(16).padStart(6, "0")}`;
  }
}

export interface UserProfile {
  userId?: string;
  background: string;
  ownedBackgrounds: string[];
  darkmode: boolean;
  color: number;
  roleplay: RoleplayData;
  client: FoxxieClient;
  user: User | null;
  hexColor: HexColorString;
}

export interface RoleplayData {
  [key: string]: RoleplayMember;
}

export interface RoleplayMember {
  give: number;
  rec: number;
}

export const enum Backgrounds {
  Tree = "Tree",
  Pokemon = "Pokemon",
  Ori = "Ori",
  Fall = "Fall",
  Redwood = "Redwood",
  Lighthouse = "Lighthouse",
  Wood = "Wood",
  Mountains = "Mountains",
}
