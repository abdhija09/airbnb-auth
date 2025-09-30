const express = require('express');
const bodyParser = require('body-parser'); // renamed parsed -> bodyParser
const session = require('express-session'); // ✅ need session
const path = require('path');
const mongodbstore=require('connect-mongodb-session')(session);
const multer = require('multer');
const url = "mongodb+srv://asquare:1126@airbnb.wc3auws.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Airbnb&ssl=true&tlsAllowInvalidCertificates=true";
const { hostrouter } = require('./routes/hostrouter');
const userrouter = require('./routes/userrouter');
const authrouter = require('./routes/authrouter');

const { mongoconnect } = require('./utils/databaseutils');

const app = express();

// 1️⃣ Setup body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const store=new mongodbstore({
    uri:url,
    collection:'sessions'
});
// const randomstring=(length)=>{
//     const characters=
//     'abcdefghijklmnopqrstuvwxyz';
//     let result='';
//     for(let i=0;i<length;i++){
//         result+=characters.charAt(Math.floor(Math.random()*characters.length));
//     }
//     return result;
// }
// const storage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'public/images');
//     },
//     filename:(req,file,cb)=>{
//         cb(null,randomstring(10) +'-'+file.originalname);
//     }
// });
// const filefilter=(req,file,cb)=>{
//     if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
//         cb(null,true);
//     }
//     else{
//         cb(null,false);
//     }
// }
// app.use(multer({storage,filefilter}).single('photourl'));


// 2️⃣ Setup session
app.use(session({
    secret: "yourSecretKey", // change this to a strong secret
    resave: false,
    saveUninitialized: false,
    store:store
}));

// 3️⃣ Make isloggedin available in all EJS templates
app.use((req, res, next) => {
    res.locals.isloggedin = req.session.user ? true : false;
    next();
});
// 3️⃣ Make user available in all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;  
  next();
});

app.use("/host", (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
});
// 4️⃣ View engine & static folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/host/images", express.static(path.join(__dirname, "public/images")));
app.use('/public', express.static(path.join(__dirname, 'public')));

// 5️⃣ Routers
app.use("/host", hostrouter);
app.use(authrouter);
app.use(userrouter);


// 6️⃣ Connect to DB and start server
const port = 3003;
mongoconnect((client) => {
    console.log("Mongo connected:", client);
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
