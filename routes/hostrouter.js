const express=require('express');
const hostrouter=express.Router();
const path=require('path');
// const {getaddhome}=require('../controller/home.js');

const homescontroller=require('../controller/host.js');

// const registeredhome=[];

hostrouter.get("/add-home",homescontroller.getaddhome );
// hostrouter.post("/add-home", (req, res, next) => {
//   console.log("House added for :",req.body);
//   console.log("second middleware", req.url, req.method);
// res.sendFile(path.join(__dirname,'../','views','homeadded.html'));
// });

hostrouter.get("/host-home-list",homescontroller.gethome);
hostrouter.get("/edit-home/:homeid",homescontroller.getedithome);

hostrouter.post("/submit",homescontroller.homeadded);
// module.exports=hostrouter;
hostrouter.post("/edit-home",homescontroller.postedithome);
hostrouter.post("/delete-home/:homeid",homescontroller.postdeletehome);
exports.hostrouter=hostrouter;
// exports.registeredhome=registeredhome;