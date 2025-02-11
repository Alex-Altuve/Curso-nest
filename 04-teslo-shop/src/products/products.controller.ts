import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
//@Auth() // * *  cpara poder usar cualquiera de estar rutas debes estar autenticado
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @Post()
  @Auth(ValidRoles.admin)
  @ApiResponse({status:201, description: 'Product was created', type: Product})
  @ApiResponse({status:400, description: 'Bad request'})
  @ApiResponse({status:403, description: 'Forbidden. Token related'})
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user:User,
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Auth(ValidRoles.admin)

  @ApiResponse({status:200, description: 'Product was created', type: [Product]})
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth()
  @ApiResponse({status:200, description: 'Product was created', type: Product})
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({status:201, description: 'Product was updated', type: Product})
  @ApiResponse({status:400, description: 'Bad request'})
  @ApiResponse({status:403, description: 'Forbidden. Token related'})
  update(
    @Param('id',ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user:User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({status:200, description: 'Product was deleted'})
  @ApiResponse({status:400, description: 'Bad request'})
  @ApiResponse({status:403, description: 'Forbidden. Token related'})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
