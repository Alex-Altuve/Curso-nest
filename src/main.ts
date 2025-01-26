import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  
  app.useGlobalPipes(
    new ValidationPipe({
      //el whitelist en true elimina lo que no sea parte del dto
      whitelist: true,
      // este te valida lo que este mandando, si mandas algo que no es parte del dto, dara error
      forbidNonWhitelisted: true,
    }),
  );

    const config = new DocumentBuilder()
    .setTitle("Car Dealership API")
    .setDescription("The cars API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
