// import { PartialType } from '@nestjs/swagger';
// import { CreateBrandDto } from './create-brand.dto';

import { IsString, MinLength } from "class-validator";

// el partial type agarra las caracteristicas de ese dto y las vuelve opcionales
// export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

export class UpdateBrandDto {
    @IsString()
    @MinLength(1)
    name?: string;
}