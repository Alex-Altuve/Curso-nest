import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategies';


@Module({
  controllers: [AuthController],
  //!OJO!
  /// todas las strategies son providers igual que los servicios, no todos los providers son servicios
  providers: [AuthService, JwtStrategy],
  imports: [ 
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // console.log('configService:', configService.get('JWT_SECRET'));
        // console.log('JWT SECRET:',  process.env.JWT_SECRET);
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { 
            expiresIn: '2h' 
          }
        }
      }
    }),
    //esto debe ser asincrono por la variable de entorno
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { 
    //     expiresIn: '2h' 
    //   }
    // })
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
