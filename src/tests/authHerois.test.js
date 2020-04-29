const assert = require("assert");
const api = require("../api");
const Context = require("../db/strategies/base/contextStrategy");
const Postgres = require("../db/strategies/postgres/postgres");
const UsuarioSchema = require("../db/strategies/postgres/schemas/usuarioSchema");

let app = {};
let context = {};

const USER = {
  username: "Gerald",
  password: "123",
};

const USER_DB = {
  ...USER,
  password: "$2b$04$NfTIqQkDR4ZD2jPVEMvdXuHyWMl6P.8te/YvnMbiS9HQ1wURkmqEC",
};

describe("Suite de Testes - Autenticação de Herois", function () {
  this.timeout(Infinity);

  this.beforeAll(async function() {
    app = await api;

    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
    context = new Context(new Postgres(connectionPostgres, model));
    await context.update(null, USER_DB, true);
  });

  it("Deve obter um token", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: USER,
    });

    const statusCode = result.statusCode;  
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(dados.token.length > 10);
  });

  it('Deve retornar não autorizado ao tentar obter logar sem credenciais', async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: {username: 'Irlan', password: 'Freitas'},
    });

    const statusCode = result.statusCode;  
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 401);
    assert.ok(dados.error, 'Unauthorized');
  })
});
