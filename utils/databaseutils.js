const mongo=require('mongodb');

const MongoClient=mongo.MongoClient;


const url = "mongodb+srv://asquare:1126@airbnb.wc3auws.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Airbnb&ssl=true&tlsAllowInvalidCertificates=true";

const mongoconnect=(callback)=>{
    MongoClient.connect(url).then(Client=>{
        console.log("connected");
        callback();
        _db=Client.db('airbnb');
    }).catch(err=>{
        console.log(err);
        throw err;
    });

};
let _db;
const getdb = () => {

  if (!_db) {
    throw new Error("Database not initialized");
  }
  return _db;
}
exports.getdb = getdb;
exports.mongoconnect = mongoconnect;
