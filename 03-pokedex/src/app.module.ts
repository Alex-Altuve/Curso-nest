import { join } from 'path'; //en node
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    //esto esta activo para tener la pagina con el server estatico, se debe comentar para que funcione lo del swagger
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
      }),
      //, {dbName: 'pokemonsdb'} esto es para cuando se despliega
    MongooseModule.forRoot(process.env.MONGODB as string),  
    PokemonModule, CommonModule, SeedModule,
  ],
})
export class AppModule {
  constructor(){
    console.log('App running in', process.env.PORT);
  }
}
