import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  controllers: [CarsController],
  providers: [CarsService],
  //para que todo el mundo pueda acceder a el y se pueda hacer la inyeccion doble
  exports: [CarsService]
})
export class CarsModule {}
