const Sequelize = require("sequelize");

module.exports = {
  name: 'usuarios',
  schema: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      unique: true, 
      required: true
    },
    password: {
      type: Sequelize.STRING,
      required: true
    }
  },
  options: {
    tableName: "TB_USUARIOS",
    freezeTableName: false,
    timestamps: false
  }
};
