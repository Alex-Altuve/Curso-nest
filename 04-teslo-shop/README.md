<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


# Teslo API
1. Clonar proyecto
2. ``` npm install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar variables de desarrollo
5. Levantar la base de datos
```
docker compose up -d

```
6. Ejecutar SEED
```
http://localhost:3000/api/seed
```

7. Levantar:

```bash
# watch mode
$ npm run start:dev
```

## Autenticacion 

1. Logueate con un usuario 
2. Copiar y pegar el token en la siguiente ventana

![](public/products/images/BearerToken.png)

3. Copiar la siguiente direccion en el navegador para visualizar el swagger 

```
http://localhost:3000/docs
```


