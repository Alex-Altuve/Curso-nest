
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/cars.interface';
import {v4 as uuid } from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dto';
// principio dry - dont repeat yourself

@Injectable()
export class CarsService {
    private cars: Car[] = [
        //{id: uuid(), brand: 'Toyota', model: 'Corolla'},  
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

    update(id: string,updateCarDto: UpdateCarDto){
        let carDB = this.FindOneById(id);

        if(updateCarDto.id && updateCarDto.id !== id) throw new BadRequestException('Car id is not valid inside body');
        
        this.cars = this.cars.map(car => {
            if (car.id === id){
                carDB ={ 
                    ...carDB, 
                    ...updateCarDto,
                    id,
                };
                return carDB;
            }
            return car;
        })
        return carDB;
    }
    
    delete(id: string): string{
        const car = this.FindOneById(id);
        this.cars= this.cars.filter(car => car.id !== id);
        return 'Car deleted';            
    }

    fillCarsWithSeedData( cars: Car[]) {
        this.cars = cars;
     }

}
