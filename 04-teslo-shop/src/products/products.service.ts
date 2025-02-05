import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {validate as isUUID} from 'uuid';
import { ProductImage, Product } from './entities';
import { log } from 'console';


@Injectable()
export class ProductsService {
  //esto es para mostrar los errores en consola como un log
  private readonly logger = new Logger('ProductsService');
  constructor(
    
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    
    /// esto es para el query runner
    private readonly dataSource: DataSource
  ) {}

  async create(createProductDto: CreateProductDto){
    try{
      ///esta validacion esta en el entity
      // if(!createProductDto.slug){
      //   createProductDto.slug = createProductDto.title
      //   .toLowerCase()
      //   .replaceAll(' ','_')
      //   .replaceAll("'",'')
      // }else{
      //   createProductDto.slug = createProductDto.slug
      //   .toLowerCase()
      //   .replaceAll(' ','_')
      //   .replaceAll("'",'')
      // }
      const {images = [] , ...productDetails} = createProductDto;
   
      const product = this.productRepository.create({
        ... productDetails,
        images: images.map(image=> this.productImageRepository.create({url: image}) )
      });
      await this.productRepository.save(product);
      return {...product, images};
    }catch (error) {
      this.HandleExceptions(error);
    }
  }

  /// paginar
  async findAll( paginationDto: PaginationDto) {
    /// ese {} es que no tiene ninguna condicion para que consiga todos
    // skip es el offset y el take: limit
    const {limit = 10, offset=0} = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })
    //opcion 1
    // return products.map(
    //   product => ({
    //     ...product,
    //     images: product.images ? product.images.map(image => image.url) : []
    //   }));
    //opcion 2
    return products.map(
      ({images, ...rest}) => ({
        ...rest,
        images: images ? images.map(image => image.url) : []
      }))
  }

  async findOne(term: string) {
    let product: Product| null = null;;
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id:term}) as Product;
    }else{
      //product = await this.productRepository.findOneBy({slug:term}) as Product;
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
      //'title ILIKE :title or slug ILIKE :slug' otra opcion
        .where(' UPPER(title) =:title or slug =:slug',{
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'ProdImages')
        .getOne();
      }

    if(!product) throw new NotFoundException(`Product with term ${term} not found`);
    return product;
  
  }


  async findOnePlain(term: string){
    const {images = [], ...rest} = await this.findOne(term);
    return {
      ...rest,
      images: images ? images.map(image => image.url) : []
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const {images, ...toUpdate} = updateProductDto;
    
    // el preload es para que si no existe el id no lo cree, prepara ese objeto para poder actualizarlo
    const product = await this.productRepository.preload({
      id,
      ...toUpdate
    });

    if(!product) throw new NotFoundException(`Product with id ${id} not found`);

    //create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      if(images){
        // ese id es el id del producto que me pasa el usuario
        await queryRunner.manager.delete(ProductImage, {product: {id}});
        product.images = images.map(image => this.productImageRepository.create({url: image}));    
      }
      // }else{
      //   // ??
      //   product.images = await this.productImageRepository.findBy({product: {id}});
      // }

    
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      //await this.productRepository.save(product);
      return this.findOnePlain(id); // forma 1
      //return product; // forma 2
    }catch(error){

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.HandleExceptions(error);
    }

  }

  async remove(id: string) {
    const {affected}= await this.productRepository.delete({id})  // deleteMany es un delete * from Pokemon
    if( affected === 0) throw new BadRequestException(`Product with id ${id} not found`);

    return {mesage: `Product with id ${id} deleted`};
  }

  private HandleExceptions(error: any){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  /// esto es para la semilla esto es solo para desarollo
  async deleteAllProduct(){
    const query = this.productRepository.createQueryBuilder('product');
    try{
      return await query
                      .delete()
                      .where({})
                      .execute();
    }catch(error){
      this.HandleExceptions(error);
    }
  }
}
