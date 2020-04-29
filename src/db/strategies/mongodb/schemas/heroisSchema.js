const Mongoose = require("mongoose");

module.exports = Mongoose.model(
  "herois",
  new Mongoose.Schema({
    nome: {
      type: String,
      require: true
    },
    poder: {
      type: String,
      require: true
    },
    insertedAt: {
      type: Date,
      default: new Date()
    }
  })
);
