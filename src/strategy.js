//! Explicando como funciona esse padrão comportamental

class NotImplementedException extends Error {
  constructor() {
    super("Not Implemented Exception");
  }
}

class ICrud {
  create(item) {
    throw new NotImplementedException();
  }

  read(query) {
    throw new NotImplementedException();
  }

  update(id, item) {
    throw new NotImplementedException();
  }

  delete(id) {
    throw new NotImplementedException();
  }

}

class MongoDB extends ICrud {
    constructor() {
        super()
    }

    create(item) {
        console.log(`O item:${JSON.stringify(item)} foi salvo no mongoDb`)
    }
}

class Postgres extends ICrud {
    constructor() {
        super()
    }

    create(item) {
        console.log(`O item:${JSON.stringify(item)} foi salvo no postgres`)
    }
}

class ContextStrategy {
    constructor(strategy) {
        this._database = strategy
    }

    create(item) {
        return this._database.create(item)
    }

    read(item) {
        return this._database.read(item)
    }

    update(id, item) {
        return this._database.update(id, item)
    }

    delete(id) {
        return this._database.delete(id)
    }
}

//* Salvando no mongo
const contextMongo = new ContextStrategy(new MongoDB())
contextMongo.create({nome: "Irlan Freitas"})

//* Salvando no postgres
const contextPostgres = new ContextStrategy(new Postgres())
contextPostgres.create({nome: "Irlan Freitas"})

contextMongo.read()