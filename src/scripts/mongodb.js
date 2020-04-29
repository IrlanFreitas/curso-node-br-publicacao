docker ps // Pegar o id do container do mongo
docker exec -it 2d11d3bdeaac mongo -u irlanfreitas -p irlanfreitas --authenticationDatabase herois

show dbs //** Monstra todos os bancos */
use herois //* Ir para o banco hérois

show collections //* Exibe as "tabelas", coleções de documentos


for(let i = 0; i <= 50000;i++){
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'Fazer a mesma coisa do outro clone',
        dataNascimento: '1998-01-01'
    })
}

db.herois.count()

//! Create

db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

//! Read

db.herois.find()
db.herois.find().pretty()
db.herois.find().limit(1000).sort({nome: -1})
db.herois.find({}, {poder: 1, _id: 0})
db.herois.findOne()
db.herois.find({_id:ObjectId( '5e80dce990449b7638891246') })

//! Update

db.herois.update({ _id:ObjectId( '5e80dc5690449b7638890e5e') }, {
    nome: "Mulher Maravilha"
})

//* Objeto set utilizado para concervar os outros campos, sem perder
db.herois.update({ _id:ObjectId( '5e80dce990449b7638891246') }, {
    $set: {nome: "Lanterna Verde"}
})

//! Delete

db.herois.remove({ nome: 'Flash'})

