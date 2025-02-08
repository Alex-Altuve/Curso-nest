import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers, SetMetadata} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

import { IncomingHttpHeaders } from 'http';

import { User } from './entities/user.entity';
import { Auth,RoleProtected,RawHeaders,GetUser } from './decorators';
import { ValidRoles } from './interfaces';
import { UserRoleGuard } from './guards/user-role/user-role.guard';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth() // Indica que este endpoint requiere autenticación Bearer
  @ApiResponse({status:201, description: 'User was created', type: User})
  @ApiResponse({status:400, description: 'Bad request'})
  @ApiResponse({status:403, description: 'Forbidden. Token related'})
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({status:201, description: 'Login successfully'})
  @ApiResponse({status:400, description: 'Bad request'})
  @ApiResponse({status:403, description: 'Forbidden. Token related'})
  signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @ApiBearerAuth()
  @Auth()
  @ApiResponse({status:200, description: 'Token generated successfully'})
  @ApiResponse({status:400, description: 'Bad request'})
  @ApiResponse({status:403, description: 'Forbidden. Token related'})
  checkAuthStatus( 
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user);
  }


  // @Get('private')
  // // * *  El guard -> AuthGuard() al ser de passport e indicar en el modulo de PassportModulo que se usaria jwt
  // // * * se definidio en el auth.Modulo el provider que hereda de JwtStrategy (el personalizados que hicimos), sino estuviera especificado  usaria el por defecto que unicamente verifica que el jwt sea valido con la jwt_secret que se definio en useFactory del JWTModule
  // // !Sino pasamos por el guard no vamos a tener ese usuario!
  // @UseGuards(AuthGuard())
  // testingPrivateRoute(
  //   //@Req() request: Express.Request,
  //   // si se mandan argumentos al GetUser es asi GetUser('argumento') o GetUser(['argumento', 'segundoArgumento'])
  //   @GetUser() user: User,
  //   // ejercicio
  //   @GetUser('email') userEmail: string,
  //   @RawHeaders() rawHeaders: string[],
  //   // funcion igual al RawHeaders solo que traer la info mas bonita
  //   // @Headers() headers: IncomingHttpHeaders, 
  // ){
  //   //console.log({user: request.user});
  //   return {
  //     ok: true,
  //     message: 'This is a private route',
  //     user,
  //     email: userEmail,
  //     headers: rawHeaders
  //   }
  // }

  //   //@SetMetadata('roles',['admin','super-user'])  //* * sin esto activo no tenemos el role en la meta data para poder usar ese Guard de UserRoleGuard

  // @Get('private2')
  // @RoleProtected(ValidRoles.superUser, ValidRoles.admin) //* * con esto activo ya tenemos el role en la meta data para poder usar ese Guard de UserRoleGuard (nos ahorramos el @SetMetadata('roles',['admin''super-user']) ) -> autencicacion
  // @UseGuards(AuthGuard(),UserRoleGuard) //* *  autorizacion UserRoleGuard
  // privateRoute2(
  //   @GetUser() user: User
  // ){
  //   return {ok: true, user};
  // }

  // @Get('private3')
  // @Auth(ValidRoles.admin)
  // privateRoute3(
  //   @GetUser() user: User
  // ){
  //   return {ok: true, user};
  // }

}
