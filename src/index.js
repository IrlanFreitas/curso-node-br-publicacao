const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb')
const Postgres = require('./db/strategies/postgres')

//* Salvando no mongo
const contextMongo = new ContextStrategy(new MongoDB())
contextMongo.create({nome: "Irlan Freitas"})

//* Salvando no postgres
const contextPostgres = new ContextStrategy(new Postgres())
contextPostgres.create({nome: "Irlan Freitas"})

// contextMongo.read()