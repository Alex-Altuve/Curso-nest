
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';

@Controller('cars')
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
        return createCarDto;
    }

    @Patch(':id')
    updateCar(@Body() data:any){

        return data;
    }

    @Delete(':id')
    deleteCar(@Param('id',  ParseUUIDPipe) id: string){
        return {
            method: 'delete',
            id: id
        }
    }
}
