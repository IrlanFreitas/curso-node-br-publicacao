const Routes = require("./base/routes");
const Joi = require("@hapi/joi");
const Boom = require("boom");
const PasswordHelper = require("../helpers/passwordHelper");

//! npm i jsonwebtoken
const JWT = require("jsonwebtoken");

const failAction = (request, headers, erro) => {
  throw erro;
};

const USER = {
  username: "Gerald",
  password: "Obruxo",
};

class AuthRoutes extends Routes {
  constructor(secret, db) {
    super();
    this.secret = secret;
    this.db = db;
  }

  login() {
    return {
      path: "/login",
      method: "POST",
      config: {
        auth: false, //Não precisa de token pra gerar token
        tags: ["api"],
        description: "Método de autenticação do sistema",
        notes: "Fazer login com usuário e senha do banco",
        validate: {
          failAction,
          payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
          }),
        },
      },
      handler: async (request) => {
        const { username, password } = request.payload;

        const [usuario] = await this.db.read({
          username,
        });

        if (!usuario)
          return Boom.unauthorized("O usuário informado não existe!");

        const match = await PasswordHelper.compare(password, usuario.password);

        if (!match) return Boom.unauthorized("O usuário ou senha inválidos!");

        const token = JWT.sign({ username, id: usuario.id }, this.secret);

        return {
          token,
        };
      },
    };
  }
}

module.exports = AuthRoutes;
