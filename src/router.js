const express = require('express');
const Contenedor = require("./Contenedor");
const productosRandom = require('./faker.js');
const {checkLogged, userNotLogged} = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const passport = require("passport");
const { Strategy } = require("passport-local");
const LocalStrategy = Strategy;

const {fork} = require('child_process');
const randomNumbers = require("./randomNumbers");
const config = require("../config/config");
const productos = new Contenedor("productos.json");
const os = require("os");

const router = express.Router();

const BCRYP_SALT_ROUNDS = 12;

mongoose.connect(config.MONGO_URL)
    .then(()=> {
        console.log('Base de datos conectada')
    }).catch((err)=> {
        console.log('Error al conectar ', err)
    });
    
    const Schema = mongoose.Schema;
    const ObjectId = Schema.ObjectId;
    const UserSchema = new Schema({
        user: String,
        password:String
    });
    
const users = new mongoose.model('users', UserSchema);

passport.use(new LocalStrategy(
    async function (username, password, done) {
        console.log(`${username} ${password}`)
        const doc = users.findOne({user:username}).then((doc)=>{
            if (username && password){
                if (!doc) {
                    return done(null, false);
                } else {
                    bcrypt.compare(password, doc.password)
                    .then((valid)=>{
                        if (valid){
                            return done(null, doc)
                        } else {
                            return done(null, false)
                        }
                    })
                }           
            }
        });
    }
));

passport.serializeUser((doc, done) => {
    done(null, doc.user);
});

passport.deserializeUser((user, done) => {
    const existeUsuario = users.findOne({user:user}).then((doc)=>user == doc.username);   
    done(null, existeUsuario);
});

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

/*
router.get("/", checkLogged, (req,res) => {
    res.render('home',{username:req.session.username});
})
*/

router.get("/", isAuth, (req,res) => {
    res.render('home',{username:req.session.passport.user});
})

router.post("/products", (req,res) => {
    productos.save(req.body);
    res.redirect('/');
})

router.get('/productos-test', async (req, res) => {
    try {
        const productosFaker = productosRandom();
        res.json(productosFaker);
    } catch (err) {
        res.status(500).send(`No se puede recuperar los datos ${err}`);
    }
});

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login-error' }));

router.post("/register",async(req,res)=>{
    const {username,password} = await req.body;
    const doc = users.findOne({user:username}).then((doc)=>{
        if(username && password){
            if (doc) {
                res.render("registerError");
            } else {
                bcrypt.hash(password,BCRYP_SALT_ROUNDS)
                .then((hashPassword) =>{
                    try {
                        users.create({user:username, password:hashPassword}).then((doc)=>doc);
                    } catch (error) {
                        throw new Error(`Error al guardar: ${error}`)
                    }
                });
                res.redirect("/login");
            }
        } else{
            res.render("register",{error:"por favor ingresa el usuario y clave"})
        }
    });
});


router.get("/register",(req,res)=>{
    res.render("register")
});

router.get("/logout",(req,res)=>{
    req.session.destroy((error)=>{
        if(error){
            res.redirect("/")
        } else{
            res.render("logout")
        }
    })
});

router.get("/login-error",userNotLogged,(req,res)=>{
    res.render("loginError");
});

router.get("/login",userNotLogged,(req,res)=>{
    res.render("login");
});


/*---------------- RUTAS NUMEROS RANDOM E INFO -------------- */

router.get('/api/randoms/', (req, res) => {
    let cantDatos = parseInt(req.query.cant);
    const forked = fork('./src/randomNumbers.js', {windowsHide: true});
    forked.send(cantDatos);
    forked.on('message', numbers => {
        res.send(numbers);
        forked.kill(2);
    })
    console.log("randoms succesful")
});

router.get('/info', (req, res) =>{
    const info = {
        args: process.argv.slice(2),
        sistema: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage.rss(),
        pathEjecucion: __dirname,
        processId: process.pid,
        carpetaProyecto: process.cwd(),
        procesadores: os.cpus().length
    }
    
    res.send(info)
})

module.exports = router;