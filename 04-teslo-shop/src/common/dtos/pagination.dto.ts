import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @ApiProperty({
        default: 10,
        description: 'How many rows do you need'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) /// enableImplicitConversions: true, hace la tranformacion de string a number
    limit?:number;
    
    @ApiProperty({
        default: 0,
        description: 'How many rows do you want to skip'
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)/// enableImplicitConversions: true, hace la tranformacion de string a number
    offset?: number;
}