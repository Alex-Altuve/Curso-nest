import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto/index';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

      return userWithoutPassword

      // TODO: retornar el JWT
    }catch(e){
      this.HandleExceptions(e);
    }
  }

  async login(loginUserDto: LoginUserDto){
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true},
    })

    if(!user){
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('Credentials are not valid (password)');
    }    
    
    return user;
    // todo: retornar el JWT
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
