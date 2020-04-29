// npm install mongoose

const Mongoose = require("mongoose");
Mongoose.connect(
  "mongodb://irlanfreitas:irlanfreitas@localhost:27017/herois",
  { useNewUrlParser: true },
  error => {
    if (!error) return;
    console.log("Falha na conexao! ", error);
  }
);

const connection = Mongoose.connection;
connection.once("open", () => {
  console.log("Database rodando");
});

const state = connection.readyState
console.log("State: ", state);

/** 
 ** Estados

 ** 0: Disconectado
 ** 1: Conectado
 ** 2: Conectando
 ** 3: Disconectando
 * */ 
 
const heroiSchema = new Mongoose.Schema({
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

const model = Mongoose.model('herois', heroiSchema)

const main = async () => {
    const resultCadastrar = await model.create({nome: 'Batman', poder: 'Dinheiro'})
    console.log('resultCadastrar: ', resultCadastrar);
    
    const listItens = await model.find()
    console.log("listItens: ", listItens);
    
    // await model.remove({})
}

main()
