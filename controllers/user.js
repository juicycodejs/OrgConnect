const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


async function createUser(req, res){
    const {email, password, role} = req.body;
    
    if(password){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                const newUser = new userModel({email, password: hash, role});
                await newUser.save();

                const token = jwt.sign({ email }, "secretKey");
                res.cookie("token", token);
                
                if(newUser.role === "buyer")
                    res.redirect("/buyer");
                else
                    res.redirect("/seller")
            })
        })
    }
}

async function signin(req, res){
    const {email, password} = req.body;
    let user = await userModel.findOne({ email });

    if(!user)
        res.render("login", {error: "( Incorrect email or password )"});
    else{
        bcrypt.compare(password, user.password, function (err, result){
            if(result){
                const token = jwt.sign({ email }, "secretKey");
                res.cookie("token", token);

                if(user.role === "seller")
                    return res.redirect("/seller");
                else
                    return res.redirect("/buyer");
            }
            else
                res.render("login", {error: "( Incorrect email or password )"});
        })
    }
}

async function logout(req, res){
    res.cookie("token", "");
    res.redirect("/");
}

module.exports = {
    createUser,
    signin,
    logout,
}