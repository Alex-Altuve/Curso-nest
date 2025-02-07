import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';

import * as bcrypt from 'bcrypt';



@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly productsService: ProductsService,
  ) {}

  async runSeed() {
    await this.deleteTable();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return {message: 'Seed execute'};
  }

  private async deleteTable(){
    await this.productsService.deleteAllProduct();
    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
    .delete()
    .where({})
    .execute();
    
  }

  private async insertUsers(){
    const seedUsers = initialData.users;
   
    const users: User[] = [];
    seedUsers.forEach( ({password, ...restUser})  => {
      users.push(this.userRepository.create(
        {
          ...restUser,
          password: bcrypt.hashSync(password, 10),
        }
      ));
    });

    const dbUsers = await this.userRepository.save(users);
    return dbUsers[0];
  }

  private async insertNewProducts(user: User){
    await this.productsService.deleteAllProduct();
    const products = initialData.products;
    
    const insertPromises =products.map( productData  => {
      return this.productsService.create(productData, user);
    });

    await Promise.all(insertPromises);
    return true;
  }
}


