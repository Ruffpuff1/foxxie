import { LivesInEnum } from '#utils/enums';
import { StardewValleyTypes } from '#utils/StardewValley';
import { Field, ObjectType } from 'type-graphql';
import { villagers } from '../server';
import { FamilyRelation } from './FamilyRelation';

@ObjectType({ description: "A character's data." })
export class Villager {
    @Field(() => villagers, { description: "The name of the villager and the key by which it's stored." })
    public key!: StardewValleyTypes.Villager['key'];

    @Field(() => String, { description: 'The birthday of the villager.' })
    public birthday: StardewValleyTypes.Villager['birthday'];

    @Field(() => LivesInEnum, { description: 'The location the villager lives in.' })
    public livesIn: StardewValleyTypes.Villager['livesIn'];

    @Field(() => String, { description: 'The address of the villager.' })
    public address: StardewValleyTypes.Villager['address'];

    @Field(() => [FamilyRelation], { description: 'The family of the villager.' })
    public family: StardewValleyTypes.Villager['family'];

    @Field(() => [villagers], { description: 'The friends of the villager.' })
    public friends: StardewValleyTypes.Villager['friends'];

    @Field(() => Boolean, { description: 'If you are able to marry this villager.' })
    public marriage: StardewValleyTypes.Villager['marriage'];

    @Field(() => [String], { description: 'The best gifts to gift to this villager.' })
    public bestGifts: StardewValleyTypes.Villager['bestGifts'];

    @Field(() => String, { nullable: true, description: 'A description of the villager.' })
    public description: StardewValleyTypes.Villager['description'];

    @Field(() => String, { nullable: true, description: 'The portrait of the villager.' })
    public portrait: StardewValleyTypes.Villager['portrait'];
}
