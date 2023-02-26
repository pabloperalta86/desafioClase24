const checkLogged = (req,res,next)=>{
    if(req.session.username){
        next();
    } else {
        res.redirect("/login");
    }
}

const userNotLogged = (req,res,next)=>{
    if(req.session.username){
        res.redirect("/");
    } else {
        next();
    }
}

module.exports = {checkLogged, userNotLogged}