const dotenv = require("dotenv");
dotenv.config();

const config = {
    MONGO_URL: process.env.MONGO_URL || "mongodb+srv://pablo:coder@cluster0.rinfwea.mongodb.net/?retryWrites=true&w=majority",
    SECRET_SESSION: process.SECRET_SESSION || "ClaveSuperSecreta",
    MYSQL_HOST: process.MYSQL_HOST || "localhost",
    MYSQL_PORT: process.MYSQL_PORT || "3306",
    MYSQL_USER: process.MYSQL_USER || "pperalta",
    MYSQL_PASSWORD: process.MYSQL_PASSWORD || "1",
    MYSQL_DATABASE: process.MYSQL_DATABASE || "ecommerce",
    SQLLITE3_FILE: process.SQLLITE3_FILE || "./db/ecommerce.sqlite"
};

module.exports = config;