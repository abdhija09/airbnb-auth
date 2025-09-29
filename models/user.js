

const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

class UserModel {
  constructor(db) {
    this.collection = db.collection("users");
  }

  // Create new user (for signup page)
  async createUser({ firstname, lastname, email, password, usertype }) {
    // check duplicate email
    const existingUser = await this.collection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error("Email already registered. Please use another one.");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashedPassword,
      usertype, // guest or host
      createdAt: new Date(),
    };

    const result = await this.collection.insertOne(newUser);
    return result.insertedId;
  }

  // Find user by email (for login)
  async findByEmail(email) {
    return await this.collection.findOne({ email: email.toLowerCase() });
  }

  // Find user by ID
  async findById(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  // Compare passwords
  async comparePassword(enteredPassword, storedHash) {
    return await bcrypt.compare(enteredPassword, storedHash);
  }
}

module.exports = UserModel;

