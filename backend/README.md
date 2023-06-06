

## Description

a nest js working example with product entities, user entity and session based auth with typeorm integration

## Installation

using any package manager install the dependencies 

`npm i`
`pnpm i`
`yarn add`

to access the database you will also need docker install on your computer. this step is valid for macos and wsl systems

once docker is installed run the command 
  `docker compose up -d`

make sure to be in the nest-emplate/backend folder to do this

this will install the containers for postgres, redis and aws local stack for s3

once the docker containers are up and running you can use 
`npm run migration:run:postgres`
to get all entities into your database, this step needs to be done before starting the project

you can use nestjs official docs for more info on how the moduel system works with nestjs

## Datbase Interactions
to generate a migration that auto generates sql bases on the classes defined in .entity.ts files

`migration:generate:postgres` as an arguement to this command you will need to supply the path of the migration file
for this project it will be src/database/migrations/<name of file>

i use pnpm so if would use 
`pnpm migration:generate:postgres src/database/migrations/test` 
 
 this same process can be followed to create a blank migration
`pnpm migration:create:postgres src/database/migrations/test`

to completely drop the db
`pnpm run db:drop:postgres`

this will clean your entire database and you can run migrations again to fix any errors
 
 
