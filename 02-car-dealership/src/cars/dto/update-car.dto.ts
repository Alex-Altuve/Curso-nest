import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateCarDto {
    // el ? indica que es opcional por parte de ts
    @IsString()
    @IsUUID()
    @IsOptional()
    readonly id?: string;

    @IsString()
    @IsOptional()
    readonly brand?: string;
    
    @IsString()
    @IsOptional()
    readonly model?: string;
}