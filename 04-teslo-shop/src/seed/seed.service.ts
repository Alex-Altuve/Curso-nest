import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  async runSeed() {
    await this.insertNewProduct();
    return {message: 'Seed execute'};
  }

  private async insertNewProduct(){
    await this.productsService.deleteAllProduct();
    const products = initialData.products;
    
    const insertPromises =products.map( productData  => {
      return this.productsService.create(productData);
    });

    await Promise.all(insertPromises);
    return true;
  }
}
