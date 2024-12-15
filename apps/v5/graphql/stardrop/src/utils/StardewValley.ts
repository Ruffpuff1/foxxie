import type { LivesInEnum, SeasonEnum } from './enums';

export namespace StardewValleyTypes {
    export interface FamilyRelation {
        key: string;
        relation: string;
    }
    export interface Villager {
        key: string;

        aliases?: string[];

        birthday: `${SeasonEnum} ${number}`;

        livesIn: `${LivesInEnum}`;

        address: string;

        family: FamilyRelation[];

        friends: string[];

        marriage: boolean;

        bestGifts: string[];

        description?: string;

        room?: string;

        portrait: string;
    }
}
