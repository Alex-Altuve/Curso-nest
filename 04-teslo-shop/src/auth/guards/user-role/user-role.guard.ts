import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly JwtService: JwtService,
    private readonly reflector: Reflector
  ){}
  
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRole: string[] = this.reflector.get(META_ROLES,context.getHandler())
    
    if(!validRole) return true;
    if(validRole.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if(!user) throw new BadRequestException('User not found');
    
    for(const role of user.roles){
      if(validRole.includes(role)){
        return true;
      }
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }
    
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }
    //console.log(token);
    const payload = this.JwtService.verify(token);
    if(!payload) throw new UnauthorizedException('Invalid token');
   
    throw new ForbiddenException(
    `User ${user.fullName} need a valid rol: [${validRole}]`);
  }
}
