import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{
    
    @IsOptional()
    @IsPositive()
    @Type(() => Number) /// enableImplicitConversions: true, hace la tranformacion de string a number
    limit?:number;
    
    @IsOptional()
    @Min(0)
    @Type(() => Number)/// enableImplicitConversions: true, hace la tranformacion de string a number
    offset?: number;
}