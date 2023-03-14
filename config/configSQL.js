const config = require("./config");

const mysql = {
    client: 'mysql',
    connection: {
        host : config.MYSQL_HOST,
        port : config.MYSQL_PORT,
        user : config.MYSQL_USER,
        password : config.MYSQL_PASSWORD,
        database : config.MYSQL_DATABASE
    }
}

const sqlite3 = {
    client: 'sqlite3',
    connection: {
        filename: (config.SQLLITE3_FILE)
    },
    useNullAsDefault: true
}

const mongoDB = {
    mongoUrl: config.MONGO_URL
}

module.exports = {mysql, sqlite3, mongoDB};