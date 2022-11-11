import { Field, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
@ArgsType()
export class GetUserArgs{
    @Field()
    @IsNotEmpty()
    @IsString()
    _id: string
}