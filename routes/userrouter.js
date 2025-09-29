const express = require('express');
const userrouter = express.Router();
const homescontroller = require('../controller/store.js');
const errorcontroller = require('../controller/404.js');

userrouter.get("/", homescontroller.gethome);
userrouter.get("/store/bookings", homescontroller.getbooking);
userrouter.get("/store/front-list", homescontroller.gethomelist);
userrouter.get("/favorites", homescontroller.getfavorite);

userrouter.post("/favorite/delete-home/:homeid", homescontroller.deletehomefromfavorites);
// Add to favorites with query parameter ?homeid=1

userrouter.get("/homes/:homeid", homescontroller.gethomedetails);
// Render favorites page
userrouter.post("/favorites", homescontroller.addtofavorite);
// userrouter.get("/favorites/add", homescontroller.addtofavorite);

userrouter.use("", errorcontroller.error);

module.exports = userrouter;
 