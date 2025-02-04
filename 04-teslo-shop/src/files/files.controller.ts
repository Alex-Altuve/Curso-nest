import { Response } from 'express';
import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { filefilter, fileNamer } from './helpers/index';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: filefilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if(!file) return new BadRequestException('Make sure that the file is an image');
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return {
      secureUrl: secureUrl
    };
  }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProducImage(imageName);
    res.sendFile(path);
  }
}


