import { ArgsType, Field } from 'type-graphql';
import { IsNumber, IsString } from 'class-validator';

@ArgsType()
export class VillagerArgs {
    @Field(() => String, { description: 'The name of the villager to look up.' })
    @IsString()
    public villager!: string;

    @Field(() => Number, { description: 'When fuzzy searching, this is the amount of villagers to return.', nullable: true })
    @IsNumber()
    public take?: number;
}
