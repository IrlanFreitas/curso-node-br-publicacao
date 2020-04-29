const Routes = require("./base/routes");
const Joi = require("@hapi/joi");
const Boom = require("boom");

const failAction = (request, headers, erro) => {
  throw erro;
};

const headers = Joi.object({
  authorization: Joi.string().required(),
}).unknown();

class HeroRoutes extends Routes {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: "/herois",
      method: "GET",
      config: {
        tags: ["api"],
        description: "Deve listar herois",
        notes: "Pode paginar resultados e filtrar por nome",
        validate: {
          //payload == body
          //header || head
          //params -> na url :id
          //query -> ?skip=10&limit=100
          failAction,
          headers,
          query: Joi.object({
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100),
          }),
        },
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query;
          const query = nome ? { nome: { $regex: `.*${nome}*.` } } : {};

          return this.db.read(query, skip, limit);
        } catch (error) {
          // console.log("DEU RUIM: ", error);
          return Boom.internal();
        }
      },
    };
  }

  create() {
    return {
      path: "/herois",
      method: "POST",
      config: {
        tags: ["api"],
        description: "Deve adicionar heroi",
        notes: "Cadastrando o heroi por nome e poder",
        validate: {
          failAction,
          headers,
          payload: Joi.object({
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(3).max(100),
          }),
        },
      },
      handler: async (request, headers) => {
        try {
          const { payload } = request;

          const result = await this.db.create(payload);

          return { _id: result.id, message: "Heroi cadastrado com sucesso!" };
        } catch (error) {
          // console.log("DEU RUIM: ", error);
          return Boom.internal();
        }
      },
    };
  }

  update() {
    return {
      path: "/herois/{id}",
      method: "PATCH",
      config: {
        tags: ["api"],
        description: "Deve atualizar herois",
        notes: "Modificando somente o necessário",
        validate: {
          failAction,
          headers,
          params: Joi.object({
            id: Joi.string().required(),
          }),
          payload: Joi.object({
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(3).max(100),
          }),
        },
      },
      handler: async (request, headers) => {
        try {
          const { id } = request.params;
          const { payload } = request;

          const dados = JSON.parse(JSON.stringify(payload));

          const result = await this.db.update(id, dados);

          if (result.nModified !== 1) {
            return Boom.preconditionFailed("Id não encontrado");
          }

          return { message: "Heroi atualizado com sucesso" };
        } catch (error) {
          // console.log("DEU RUIM: ", error);
          return Boom.internal();
        }
      },
    };
  }

  delete() {
    return {
      path: "/herois/{id}",
      method: "DELETE",
      config: {
        tags: ["api"],
        description: "Deve deletar herois",
        notes: "Removendo por id do banco de dados",
        validate: {
          failAction,
          headers,
          params: Joi.object({
            id: Joi.string().required(),
          }),
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const result = await this.db.delete(id);

          if (result.deletedCount !== 1) {
            return Boom.preconditionFailed("Id não encontrado");
          }

          return { message: "Heroi deletado com sucesso" };
        } catch (error) {
          // console.log("DEU RUIM: ", error);
          return Boom.internal();
        }
      },
    };
  }
}

module.exports = HeroRoutes;
