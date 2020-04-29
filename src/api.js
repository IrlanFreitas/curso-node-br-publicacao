//* npm i hapi

//* Usando a Swagger para documentação
//* npm i vision inert hapi-swagger

//* Usando JWT e Bcypt para segurança da aplicação
//* npm i hapi-auth-jwt2
//* npm i bcrypt

//* Usada para mudança de ambiente, env e prod
//* npm i dotenv
//* npm i cross-env -g

//* npm i -g heroku : Para subir o postgres no heroku

const { config } = require("dotenv");
const { join } = require("path");
const { ok } = require("assert");

const env = process.env.NODE_ENV || "dev";
ok(env === "production" || env === "dev", "Env inválida, ou dev ou prod");

const configPath = join(__dirname, "./config", `.env.${env}`);
config({ path: configPath });

const Hapi = require("@hapi/hapi");

const Context = require("./db/strategies/base/contextStrategy");

const MongoDb = require("./db/strategies/mongodb/mongodb");
const HeroiSchema = require("./db/strategies/mongodb/schemas/heroisSchema");

const Postgres = require("./db/strategies/postgres/postgres");
const UsuarioSchema = require("./db/strategies/postgres/schemas/usuarioSchema");

const HeroRoute = require("./routes/heroRoutes");
const AuthRoute = require("./routes/authRoutes");
const UtilRoute = require("./routes/utilRoutes");

const HapiSwagger = require("hapi-swagger");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");

const HapiJwt = require("hapi-auth-jwt2");

const JWT_SECRET = process.env.JWT_KEY;

const app = new Hapi.Server({
  port: process.env.PORT,
});

const mapRoutes = (instance, methods) => {
  return methods.map((method) => instance[method]());
};

const swaggerOptions = {
  info: {
    title: "API Herois - #CursoNodeBR",
    version: "v1.0",
  },
};

const main = async () => {
  const connectionPostgres = await Postgres.connect();
  const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
  const contextPostgres = new Context(new Postgres(connectionPostgres, model));

  const connectionMongoDb = MongoDb.connect();
  const contextMongoDb = new Context(
    new MongoDb(connectionMongoDb, HeroiSchema)
  );

  await app.register([
    HapiJwt,
    Vision,
    Inert,
    { plugin: HapiSwagger, options: swaggerOptions },
  ]);

  app.auth.strategy("jwt", "jwt", {
    key: JWT_SECRET,
    // options: {
    //   expiresIn: 20
    // }
    validate: async (dado, request) => {
      //Verificar no banco se o usuário continua ativo
      //Verificar no banco se o usuário continua pagando

      const [result] = await contextPostgres.read({
        username: dado.username,
      });

      if (!result)
        return {
          isValid: false,
        };

      return {
        isValid: true,
      };
    },
  });

  app.auth.default("jwt");

  app.route([
    ...mapRoutes(new HeroRoute(contextMongoDb), HeroRoute.methods()),
    ...mapRoutes(
      new AuthRoute(JWT_SECRET, contextPostgres),
      AuthRoute.methods()
    ),
    ...mapRoutes(new UtilRoute(), UtilRoute.methods()),
  ]);

  await app.start();
  console.log("Servidor rodando na porta: ", app.info.port);

  return app;
};

module.exports = main();
