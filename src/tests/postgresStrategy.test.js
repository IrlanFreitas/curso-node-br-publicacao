const assert = require("assert");
const Postgres = require("../db/strategies/postgres/postgres");
const heroiSchema = require('../db/strategies/postgres/schemas/heroisSchema')
const Context = require("../db/strategies/base/contextStrategy");

const MOCK_HEROI_CADASTRAR = { nome: "Gavião Negro", poder: "Mira" };
const MOCK_HEROI_ATUALIZAR = { nome: "Batman", poder: "Dinheiro" };
let context = {}

describe("Postgres Strategy", function() {
  this.timeout(Infinity);

  this.beforeAll(async function() {
    const connection = await Postgres.connect()
    const model = await Postgres.defineModel(connection, heroiSchema)
    context =  new Context(new Postgres(connection, model));
    await context.delete()
    await context.create(MOCK_HEROI_ATUALIZAR)
  });

  it("PostgresSQL Connection", async () => {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it("Cadastrar", async () => {
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it("Listar", async () => {
    const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it("Atualizar", async () => {
    const [itemAtualizar] = await context.read({
      nome: MOCK_HEROI_ATUALIZAR.nome
    });

    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: "Mulher Maravilha"
    };

    const [result] = await context.update(itemAtualizar.id, novoItem);
    const [itemAtualizado] = await context.read({ id: itemAtualizar.id });
    assert.deepEqual(result, 1);
    assert.deepEqual(itemAtualizado.nome, novoItem.nome);
  });

  it("Remover", async () => {
    const [item] = await context.read({});
    const result = await context.delete(item.id);

    assert.deepEqual(result, 1);
  });
});
