const assert = require("assert");
const api = require("./../api");

let app = {};

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdlcmFsZCIsImlkIjoxLCJpYXQiOjE1ODc0MjI5MzJ9.jL0Djx2JWsK9Befa2_I-OZPQAxSfSsPiphf9vK6xilE"

const headers = {
  Authorization: TOKEN
}

const MOCK_DEFAULT_CADASTRAR = {
  nome: "Static Shock",
  poder: "To be black",
};

const MOCK_DEFAULT_ATUALIZAR = {
  nome: "Hawkeye",
  poder: "Anel mágico",
};

let MOCK_ID_UPLETE = null;

describe("Suite de teste da API Herois", function () {
  this.timeout(Infinity)
  this.beforeAll(async () => {
    app = await api;

    const result = await app.inject({
      method: "POST",
      url: "/herois",
      headers,
      payload: MOCK_DEFAULT_ATUALIZAR,
    });

    MOCK_ID_UPLETE = JSON.parse(result.payload)._id;
  });

  it("Listar GET /herois", async () => {
    const result = await app.inject({
      method: "GET",
      url: "/herois",
      headers,
    });
    const dados = JSON.parse(result.payload);

    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);

    assert.ok(Array.isArray(dados));
  });

  it("Listar GET /herois - Deve retornar somente 10 registros", async () => {
    const LIMITE = 10;

    const result = await app.inject({
      method: "GET",
      url: `/herois?skip=0&limit=${LIMITE}`,
      headers,
    });

    const dados = JSON.parse(result.payload);

    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length === LIMITE);
  });

  it("Listar GET /herois - Deve invalidar o tipo limit", async () => {
    const LIMITE = "AEE";

    const result = await app.inject({
      method: "GET",
      url: `/herois?skip=0&limit=${LIMITE}`,
      headers,
    });

    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 400);
  });

  it("Listar GET /herois - Deve filtrar um item", async () => {

    const result = await app.inject({
      method: "GET",
      url: `/herois?skip=0&limit=10&nome=${MOCK_DEFAULT_ATUALIZAR.nome}`,
      headers,
    });
    const dados = JSON.parse(result.payload);

    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(dados[0].nome === MOCK_DEFAULT_ATUALIZAR.nome);
  });

  it("Cadastrar POST - /herois", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/herois",
      payload: MOCK_DEFAULT_CADASTRAR,
      headers,
    });

    const { message, _id } = JSON.parse(result.payload);

    assert.ok(result.statusCode === 200);
    assert.notStrictEqual(_id, undefined);
    assert.deepEqual(message, "Heroi cadastrado com sucesso!");
  });

  it("Atualizar PATCH - /herois/id", async () => {
    const expected = { poder: "Ser foda" };

    const result = await app.inject({
      method: "PATCH",
      url: `/herois/${MOCK_ID_UPLETE}`,
      payload: expected,
      headers,
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, "Heroi atualizado com sucesso");
  });

  it("Deletar DELETE - /herois/id ", async () => {
    const result = await app.inject({
      method: "DELETE",
      url: `/herois/${MOCK_ID_UPLETE}`,
      headers,
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, "Heroi deletado com sucesso");
  });

  it("Deletar DELETE - /herois/id - Não deve remover", async () => {
    const result = await app.inject({
      method: "DELETE",
      url: `/herois/${MOCK_ID_UPLETE}`,
      headers,
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 412);
    assert.deepEqual(dados.message, "Id não encontrado");
  });

  it("Atualizar PATCH - /heroi/id - Não deve atualizar com ID incorreto", async () => {

    const result = await app.inject({
      method: "PATCH",
      url: `/herois/ID_INVALIDO`,
      payload: { poder: "Ser foda" },
      headers,
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
    const expected = {
      statusCode: 500,
      error: "Internal Server Error",
      message: "An internal server error occurred",
    };
    
    assert.ok(statusCode === 500);
    assert.deepEqual(dados, expected);
  });
});
