import { ArgsType, Field } from 'type-graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class VillagerArgs {
    @Field(() => String, { description: 'The name of the villager to look up.' })
    @IsString()
    public villager!: string;
}
