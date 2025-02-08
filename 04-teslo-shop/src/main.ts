import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
//  .addBearerAuth() esto es para que bloquee los endpoint
  const config = new DocumentBuilder()
  .setTitle('Teslo RESTFul API')
  .setDescription('Teslo shop endpoints')
  .addBearerAuth() // Agregar soporte para autenticación Bearer
  .setVersion('1.0')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  await app.listen(process.env.PORT ?? 3000);
  logger.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
