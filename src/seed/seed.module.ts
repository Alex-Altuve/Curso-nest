import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CarsModule } from 'src/cars/cars.module';
import { BrandsModule } from 'src/brands/brands.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  // para importar modulos y con ellos accedo a las cosas que ellos tengo public
  imports: [CarsModule, BrandsModule],
})
export class SeedModule {}
