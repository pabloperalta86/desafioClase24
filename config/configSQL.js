const mysql = {
    client: 'mysql',
    connection: {
        host : 'localhost',
        port : 3306,
        user : 'pperalta',
        password : '1',
        database : 'ecommerce'
    }
}

const sqlite3 = {
    client: 'sqlite3',
    connection: {
        filename: ('./db/ecommerce.sqlite')
    },
    useNullAsDefault: true
}

const mongoDB = {
    mongoUrlSessions:"mongodb+srv://pablo:coder@cluster0.rinfwea.mongodb.net/?retryWrites=true&w=majority"
}

module.exports = {mysql, sqlite3, mongoDB};