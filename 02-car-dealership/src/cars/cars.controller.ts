import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiTags } from '@nestjs/swagger';

// el controlador no maneja la logica del negocio, solo se encarga de escuchar y dar una respuesta
@ApiTags('cars')
@Controller('cars')
//@UsePipes(ValidationPipe)
export class CarsController {
    //la inyeccion de dependencias siempre se hace en el constructor
    constructor(
        private readonly carsService: CarsService
    ){}

    @Get()
    getAllCars() {
        return this.carsService.FindAll();
    }

    @Get(':id')
    getCarById( @Param('id', ParseUUIDPipe) uuid: string) {
        return this.carsService.FindOneById(uuid);
    }

    @Post()
    createCar(@Body() createCarDto: CreateCarDto){
        return this.carsService.create(createCarDto);
    }

    @Patch(':id')
    updateCar( 
      @Param('id', ParseUUIDPipe) uuid: string,
      @Body() updateCarDto:UpdateCarDto){

        return this.carsService.update(uuid, updateCarDto);
    }

    @Delete(':id')
    deleteCar(@Param('id',  ParseUUIDPipe) id: string){
        return this.carsService.delete(id);
    }
}
