const ContenedorSql = require('./ContenedorSql.js');
const { mysql, sqlite3, mongoDB } = require('../config/configSQL.js');
const product = new ContenedorSql(mysql);
const chat = new ContenedorSql(sqlite3);
const axios = require("axios"); 
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const express = require('express');
const http = require('http');
const router = require('./router');
const app = express();
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const Contenedor = require('./Contenedor.js');
const passport = require("passport");
const config = require("../config/config");
const minimist = require("minimist");
const cluster = require("cluster");
const os = require("os");
const numCores = os.cpus().length;
const {logger} = require("../log/logger");

const argvPort = minimist(process.argv.slice(2), {alias: {"pp": "port", "m": "mode"}})

const PORT = process.env.PORT || 8080;
const MODE = argvPort.mode || "FORK";
console.log(argvPort,process.argv.slice(2))
if(MODE === "CLUSTER" && cluster.isPrimary){
    for(let i=0;i<numCores;i++){
        cluster.fork();
    };

    cluster.on("exit",(worker)=>{
        console.log(`proceso ${worker.process.pid} murio`);
        cluster.fork();
    });

} else {

crearTablas = async () => {
    await product.crearTabla();
    await chat.crearTablaMessage();
}

crearTablas();

const server = http.createServer(app);
const io = new Server(server);


//const product = new Contenedor("productos.json");
//const chat = new Contenedor("chat.json")

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
/*
    store: MongoStore.create({
        mongoUrl:mongoDB.mongoUrl,
    }),
*/
    secret:config.SECRET_SESSION,
    resave:false,
    saveUninitialized:false,
    rolling:true,
    cookie:{maxAge: 60000}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", router);

app.use((req,_res,next) => {

    logger.info(`Ruta inexistente en el servidor: ${req.url} - Metodo: ${req.method}`);
    logger.warn(`Ruta inexistente en el servidor: ${req.url} - Metodo: ${req.method}`);
    next();
    // Ruta y método de las peticiones a rutas inexistentes en el servidor (warning)
});

app.set('views', './views'); 
app.set('view engine', 'hbs');
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: './views/layouts',
}))

io.on('connection', async (socket) => {
    console.log('🟢 Usuario conectado.')
    
    //const productos = await product.getAllProducts();
    //socket.emit('bienvenidoLista', productos )

    await axios.get(`http://localhost:${PORT}/productos-test`)
    .then(function (response) {
        socket.emit('bienvenidoLista', response.data)
    })
    .catch(function (error) {
        console.log(error);
    })

    const mensajes = await chat.getAllMessages();
    socket.emit('listaMensajesBienvenida', mensajes)
    
    socket.on('nuevoMensaje', async (data) => {
        await chat.saveMessage(data);
        io.sockets.emit('listaMensajesActualizada', await chat.getAllMessages())
    })

    socket.on('productoAgregado', async (data) => {
        await product.save(data);
        const productos = await product.getAllProducts();
        io.sockets.emit('listaActualizada', productos);
    })

    socket.on('disconnect', () => {
        console.log('🔴 Usuario desconectado')
    })

})

server.listen(PORT, () => {
    console.log(` >>>>> 🚀 Server started at http://localhost:${PORT} proceso: ${process.pid}`)
})

server.on('error', (err) => console.log(err))

}