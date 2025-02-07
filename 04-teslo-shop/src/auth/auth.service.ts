import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';


@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create( createUserDto: CreateUserDto) {
    try{
      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);

      const { password: _, ...userWithoutPassword } = user;

      return {
        ... userWithoutPassword, 
        token: this.getJwtToker({id: userWithoutPassword.id})
      };

      // TODO: retornar el JWT
    }catch(e){
      this.HandleExceptions(e);
    }
  }

  async checkAuthStatus(user: User){
    return {
      ...user, 
      token: this.getJwtToker({id: user.id})
    };
  }

  async login(loginUserDto: LoginUserDto){
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id:true}, //!OJO!
    })

    if(!user){
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('Credentials are not valid (password)');
    }    
    
    const { id: _, ...userWithoutID } = user;
    return {
      ... userWithoutID, 
      token: this.getJwtToker({id: user.id})
    };
    // todo: retornar el JWT
  }

  private getJwtToker(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  /// never porque jamas regresara un valor
  private HandleExceptions(error: any): never{
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
