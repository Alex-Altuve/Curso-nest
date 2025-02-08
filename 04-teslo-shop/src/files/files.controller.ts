import { Response } from 'express';
import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { filefilter, fileNamer } from './helpers/index';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';


@ApiTags('File- Get and Upload')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Post('product')
  @Auth()
  @ApiResponse({status:201, description: 'file created successfully'}) 
  @ApiResponse({status:400, description: 'Bad request'})
  @ApiResponse({status:403, description: 'Forbidden. Token related'})
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
  @Auth()
  @ApiResponse({status:200, description: 'file send successfully'}) 
  @ApiResponse({status:400, description: 'Bad request'})
  @ApiResponse({status:403, description: 'Forbidden. Token related'})
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProducImage(imageName);
    res.sendFile(path);
  }
}


