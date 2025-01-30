<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

# Ejetuctar en desarollo

1. Clonar el repositorio
2. Ejecutar
```
npm install
```

3. Tener Nest CLI intalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker- compose up -d
```
5. Clonar el achivo __env.template__ y renombrar la copia a  __.env__

6. Llenar las variables de entorno definidas en el ```.env```

7. Ejucart la aplicacion en dev:

```
npm run start:dev
```

5. Reconstruir la base de datos con la semilla 

```
localhost:3000/api/v2/seed
```
# Production Build
1. Crear el archivo ``` .env.prod ```
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen

```
docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build
```
5. Para levantar el docker

```
docker-compose -f docker-compose.prod.yml --env-file .env.prod up
```

## Nota
Por defecto, docker-compose usa el archivo .env, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, bastaría con

```
docker-compose -f docker-compose.prod.yml up --build
```

## Stack usado
* MongoDB v5.0
* Nest
