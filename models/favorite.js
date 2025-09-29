const { getdb } = require('../utils/databaseutils');
const { ObjectId } = require('mongodb');

module.exports = class Favorite {
  constructor(houseid){
   this.houseid=houseid;
  }

  save(){
    const db=getdb();
    return db.collection('favorites').insertOne(this);
  }
  static getfavorites() {
    const db = getdb(); 
    return db.collection('favorites').find().toArray();
  }
  
  static deleteById(homeid) {
  const db = getdb();
  return db.collection('favorites').deleteOne({
    houseid: String(homeid)
  });
}


};
