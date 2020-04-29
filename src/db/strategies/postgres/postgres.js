const ICrud = require("../interfaces/interfaceCrud");
const Sequelize = require("sequelize");

class Postgres extends ICrud {

  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.log("Fail connection postgres: ", error);
      return false;
    }

  }

  static async connect() {
    
    const connection = new Sequelize(process.env.POSTGRES_URL, {
      quoteIdentifiers: false,
      rejectUnauthorized: true,
      logging: false,
      ssl: JSON.parse(process.env.SSL_DB),
      dialectOptions: {
        ssl: JSON.parse(process.env.SSL_DB)
      }
    });
    return connection
  }

  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options);
    await model.sync();

    return model;
  }

  async create(item) {
    const { dataValues } = await this._schema.create(item);

    return dataValues;
  }

  async update(id, item, upsert) {
    const fn = upsert ? 'upsert' : 'update'
    
    return this._schema[fn](item, { where: { id } });
  }

  async read(item = {}, skip, limit) {
    // console.log("Schema: ", this._schema);
    
    return this._schema.findAll({ where: item, raw: true });
    // return this._schema.findAll({});
  }

  async delete(id) {
    const query = id ? { id } : {};
    return this._schema.destroy({ where: query });
  }
}

module.exports = Postgres;
