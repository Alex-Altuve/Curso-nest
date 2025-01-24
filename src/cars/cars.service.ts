import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/cars.interface';
import {v4 as uuid } from 'uuid';
import { CreateCarDto } from './dto/create-car.dto';

@Injectable()
export class CarsService {
    private cars: Car[] = [
        {id: uuid(), brand: 'Toyota', model: 'Corolla'},
        {id: uuid(), brand: 'Honda', model: 'Civic'},
        {id: uuid(), brand: 'Jeep', model: 'Cherokee'}
    ];

    FindAll() {
        return this.cars;
    }

    FindOneById(id: string){
        const car = this.cars.find(car => car.id === id);
        if(!car) throw new NotFoundException(`Car with id ${id} not found`);
        return car;
    }
    
    create(createCarDto: CreateCarDto){
        const newCar: Car = {
            id: uuid(),
            // ayuda a esparcir las porpiedades del objeto
            ...createCarDto
            /// es lo mismo que esto
            // brand: createCarDto.brand,
            // model: createCarDto.model
        }
        this.cars.push(newCar);
        return newCar;
    }
}
