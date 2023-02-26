const express = require('express');
const Contenedor = require("./Contenedor");
const productosRandom = require('./faker.js');
const {checkLogged, userNotLogged} = require("../middlewares/auth");

const productos = new Contenedor("productos.json");
const router = express.Router();

router.get("/", checkLogged, (req,res) => {
    res.render('home',{username:req.session.username});
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

router.post("/login",(req,res)=>{
    const {name} = req.body;
    if(name){
        req.session.username = name;
        res.redirect("/");
    } else{
        res.render("login",{error:"por favor ingresa el nombre"})
    }
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

router.get("/login",userNotLogged,(req,res)=>{
    res.render("login");
});

module.exports = router;