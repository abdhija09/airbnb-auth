const {getdb}=require('../utils/databaseutils');
const {mongoconnect} = require('../utils/databaseutils');
const { ObjectId } = require('mongodb');
module.exports=class Home {
  constructor(name, address, price,photourl,rating,description,_id) {
    this.name = name;
    this.address = address;
    this.price = price;
    this.photourl = photourl;
    this.rating=rating;  // Optional property for photo URL
    this.description=description; 
    if (_id){
    this._id = _id;}
    // Optional property for photo URL
  }

save(){
  if(this._id)//update the home{
  { const updateFields = {
    name: this.name,
    address: this.address,
    price: this.price,
    photourl: this.photourl,
    rating: this.rating,
    description: this.description
  };

    return getdb().collection('homes').updateOne({_id: new ObjectId(this._id)},{$set:updateFields});

  }else{
    return getdb().collection('homes').insertOne(this);
  }
 
}
// insertone returns a promise so we can use then and catch in the controller with a return statement
//same goes for updateone
static fetchAll(callback) {
    const db = getdb(); 
    return db.collection('homes').find().toArray();
     
  }
  static findById(homeid){
     const db = getdb(); 
    return db.collection('homes').find({
      _id: new ObjectId(String(homeid))
    }).next();
  }
  static deleteById(homeid){
    const db = getdb(); 
    return db.collection('homes').deleteOne({
      _id: new ObjectId(String(homeid))
    });
  }
}
//the filter() method is an array method that creates a new array containing only the elements that pass a test (a condition you define in a callback function).
// callback is used to handle the asynchronous nature of file reading as well as to return the data once it is read.
// const fs = require('fs');
// const path = require('path');
// const rootdir = require('../utils/pathutils');

// const p = path.join(
//     path.dirname(process.mainModule.filename),
//     'data',
//     'homes.json'
// );

// module.exports = class Home {
//   constructor(name, address, email, photourl) {
//     this.name = name;
//     this.address = address;
//     this.email = email;
//     this.photourl = photourl;
//   }

//   // This is an instance method, so it does not have the 'static' keyword.
//   save() {
//     Home.fetchAll(homes => {
//       homes.push(this);
//       fs.writeFile(p, JSON.stringify(homes), (err) => {
//         if (err) {
//           console.error("Error writing to file", err);
//         } else {
//           console.log("Data saved successfully");
//         }
//       });
//     });
//   }

//   // This is a static method that fetches all homes from the file.
//   static fetchAll(callback) {
//     fs.readFile(p, (err, data) => {
//       if (!err && data.length > 0) {
//         try {
//           callback(JSON.parse(data));
//         } catch (e) {
//           // Handle cases where the file content is not valid JSON
//           console.error('Error parsing JSON:', e);
//           callback([]);
//         }
//       } else {
//         callback([]);
//       }
//     });
//   }
// };
