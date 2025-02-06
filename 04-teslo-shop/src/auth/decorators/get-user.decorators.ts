import { createParamDecorator, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data:string, ctx) => {
        // * * la data es el argumento que le estan pasando al decorador
        // con el ctx se tiene acceso al request que es alli donde esta el user
       

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        // error 500, es error del desarrollador
        if(!user) throw new InternalServerErrorException('User not found (request)');
       
        //* * Forma del profesor
        return (!data) ? user: user[data];

        //!Mi respuesta!
        // if(data === 'email'){
        //     const {email} = user;
        //     return email;
        // }else{
        //     return user;
        // }
     
        

    }
);