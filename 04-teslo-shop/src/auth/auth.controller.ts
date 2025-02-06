import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers, SetMetadata} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorators';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/get-rawHeaders.decorators';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  // * *  El guard -> AuthGuard() al ser de passport e indicar en el modulo de PassportModulo que se usaria jwt
  // * * se definidio en el auth.Modulo el provider que hereda de JwtStrategy (el personalizados que hicimos), sino estuviera especificado  usaria el por defecto que unicamente verifica que el jwt sea valido con la jwt_secret que se definio en useFactory del JWTModule
  // !Sino pasamos por el guard no vamos a tener ese usuario!
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    //@Req() request: Express.Request,
    // si se mandan argumentos al GetUser es asi GetUser('argumento') o GetUser(['argumento', 'segundoArgumento'])
    @GetUser() user: User,
    // ejercicio
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    // funcion igual al RawHeaders solo que traer la info mas bonita
    // @Headers() headers: IncomingHttpHeaders, 
  ){
    //console.log({user: request.user});
    return {
      ok: true,
      message: 'This is a private route',
      user,
      email: userEmail,
      headers: rawHeaders
    }
  }


  @Get('private2')
  @SetMetadata('roles',['admin','super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ){
    return {ok: true, user};
  }

}
