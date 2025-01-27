import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
    //isInt, ser positivo, valor minimo 1
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    //isstring, minlenth 1
    @IsString()
    @MinLength(1)
    name: string;
}
