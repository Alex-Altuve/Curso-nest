import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    // para permitir que se transfomen los tipos de datos que quiero y justo como estan en mis dtos
    transformOptions: {
      enableImplicitConversion: true
    }
  })
  );

  app.setGlobalPrefix('api/v2');

  //para verlo desde mi swagger
  const config = new DocumentBuilder()
  .setTitle("Car Dealership API")
  .setDescription("The pokemon API description")
  .setVersion("1.0")
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
