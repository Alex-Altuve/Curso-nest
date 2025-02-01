import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {validate as isUUID} from 'uuid';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
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
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    }catch (error) {
      this.HandleExceptions(error);
    }
  }

  /// paginar
  async findAll( paginationDto: PaginationDto) {
    /// ese {} es que no tiene ninguna condicion para que consiga todos
    // skip es el offset y el take: limit
    const {limit = 10, offset=0} = paginationDto;
    return await this.productRepository.find({
      take: limit,
      skip: offset,
      //todo: relaciones
    });
  }

  async findOne(term: string) {
    let product: Product| null = null;;
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id:term}) as Product;
    }else{
      //product = await this.productRepository.findOneBy({slug:term}) as Product;
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
      //'title ILIKE :title or slug ILIKE :slug' otra opcion
        .where(' UPPER(title) =:title or slug =:slug',{
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        }).getOne();
      }

    if(!product) throw new NotFoundException(`Product with term ${term} not found`);
    return product;
  
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
}
