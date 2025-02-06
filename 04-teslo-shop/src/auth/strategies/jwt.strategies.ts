import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ){
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in the configuration');
        }

        super({
            secretOrKey: secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }
    async validate(payload: JwtPayload):Promise<User>{
        
        // este es el que se esta agregando al payload
        const {id} = payload;

        const user = await this.userRepository.findOneBy({id});
        
        if(!user) throw new UnauthorizedException('Token not valid');

        if(!user.isActive) throw new UnauthorizedException('User is inactive, talk with an admin');

        // lo que sea que voy a añadir al payload se pone en el request
        return user ;
     
    }
}
    