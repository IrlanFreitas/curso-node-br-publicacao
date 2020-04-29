const assert = require("assert");
const MongoDb = require("../db/strategies/mongodb/mongodb");
const HeroiSchema = require("../db/strategies/mongodb/schemas/heroisSchema")
const Context = require("../db/strategies/base/contextStrategy");


const MOCK_HEROI_CADASTRAR = {
  nome: "Mulher Maravilha",
  poder: "Laço"
};
const MOCK_HEROI_DEFAULT = {
  nome: `Homem Aranha-${Date.now()}`,
  poder: "Super teia"
};
const MOCK_HEROI_ATUALIZAR = {
  nome: `Patolino-${Date.now()}`,
  poder: "Velocidade"
};
let MOCK_HEROI_ATUALIZAR_ID = null;

let context = {}

describe("MongoDb suite de testes", function() {
  this.timeout(Infinity);
  this.beforeAll(async () => {
    const connection = MongoDb.connect()
    context = new Context(new MongoDb(connection, HeroiSchema))

    await context.create(MOCK_HEROI_DEFAULT);
    const result = await context.create(MOCK_HEROI_ATUALIZAR);
    MOCK_HEROI_ATUALIZAR_ID = result._id;
  });

  it.skip("Verificar conexão", async () => {
    const result = await context.isConnected();
    const expected = "Conectado";
    assert.deepEqual(result, expected);
  });

  it("Cadastrar", async () => {
    const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);

    assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
  });

  it("Listar", async () => {
    const [{ nome, poder }] = await context.read({
      nome: MOCK_HEROI_DEFAULT.nome
    });

    const result = { nome, poder };

    assert.deepEqual(result, MOCK_HEROI_DEFAULT);
  });

  it("Atualizar", async () => {
    const heroiAtualizar = {
      nome: `Pernalonga-${MOCK_HEROI_ATUALIZAR_ID}`,
      poder: "Carisma"
    };

    const resultado = await context.update(
      MOCK_HEROI_ATUALIZAR_ID,
      heroiAtualizar
    );

    assert.deepEqual(resultado.nModified, 1);
  });

  it("Remover", async () => {
      const result = await context.delete(MOCK_HEROI_ATUALIZAR_ID)

      assert.deepEqual(result.deletedCount, 1)
  });
});
