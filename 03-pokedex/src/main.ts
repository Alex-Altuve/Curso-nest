import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
