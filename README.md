# Docker

## Alguns comandos docker
docker ps - Lista todos os containers que estão sendo executados
docker images - Lista todas as imagens que foram baixadas
docker exec -it postgres //bin//sh - Entrando no container pra executar qualquer comando lá

## ---- Postgres

### * Instalando e configurando o banco de dados Postgres
docker run \ 
    --name postgres \ 
    -e POSTGRES_USER=root \ 
    -e POSTGRES_PASSWORD=root \ 
    -e POSTGRES_DB=herois \
    -p 5432:5432 \
    -d \
    postgres

### * Configurando um adminstrador de banco de dados para o postgres
docker run \
    --name adminer \
    -p 8080:8080 \
    --link postgres:postgres \
    -d \
    adminer

## ---- MongoDB

### * Instalando e configurando o banco de dados MongoDB
docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=admin \
    -d \
    mongo:4

### * Configurando um adminstrador de banco de dados para o MongoDB
docker run \
    --name mongoclient \
    -p 3000:3000 \
    -e MONGO_URL=mongodb://admin:admin@mongo:27017/admin \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient

//Executando algo dentro do container mongo

docker exec -it mongodb \
    mongo --host localhost -u admin -p admin --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user: 'irlanfreitas', pwd: 'irlanfreitas', roles: [{role:'readWrite', db:'herois'}]})"