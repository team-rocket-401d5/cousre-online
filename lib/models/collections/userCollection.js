'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usermodel = require('../user_schema.js');
const SECRET = process.env.SECRET || 'mysecret';

class Usercat {
  constructor(model) {
    this.model = model;
  }
  read(username) {
    if (username !== undefined) {
      return this.model.findOne({ username });
    } else {
      return undefined;
    }
  }

  async save(record) {
    const newRecord = new this.model(record);
    let username = newRecord.username;

    if (this.read(username)) {
      newRecord.password = await bcrypt.hash(newRecord.password, 5);
      return await newRecord.save();
    }
    return Promise.reject();
  }

  async authenticateBasic(user, password) {
    let username = user;

    const obj = await this.model.findOne({ username });
    const valid = await bcrypt.compare(password, obj.password);
    return valid ? obj : Promise.reject();
  }

  generateToken(user) {
    const token = jwt.sign({ username: user.username }, SECRET);
    return token;
  }

  async list() {
    return await this.model.find({});
  }
  async authenticateJWT(token) {
    try{
      const tokenObj = jwt.verify(token, SECRET);
      let user = await this.model.findOne({ username: tokenObj.username });
      if (user) {
        return Promise.resolve(tokenObj);
      } else {
        console.log("user doesn't exist or wrong token");
        return Promise.reject();
      }
    }catch (err){
      return Promise.reject(err.message);
    }
  }

}
class User extends Usercat {
  constructor() {
    super(Usermodel);
  }
}

module.exports = new User();
