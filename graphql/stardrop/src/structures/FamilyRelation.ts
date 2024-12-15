import { StardewValleyTypes } from '#utils/StardewValley';
import { Field, ObjectType } from 'type-graphql';
import { villagers } from '../server';

@ObjectType({ description: "A character's family relation." })
export class FamilyRelation {
    @Field(() => villagers, { description: 'The name of the family member.' })
    public key!: StardewValleyTypes.Villager['key'];

    @Field(() => String, { description: 'How the villager is related.' })
    public relation: string;
}
