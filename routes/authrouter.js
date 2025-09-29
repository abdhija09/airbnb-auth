const express = require('express');
const authrouter = express.Router();
const authcontroller = require('../controller/auth.js');


authrouter.get("/login", authcontroller.getlogin);

authrouter.post("/login", authcontroller.postlogin);
authrouter.get("/logout",authcontroller.postlogout);
authrouter.get("/signup",authcontroller.getsignup);
authrouter.post("/signup",authcontroller.postsignup);


module.exports =  authrouter;
 