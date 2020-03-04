const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: String,
    password: String,
    roleID: String,
});

module.exports = mongoose.model('user', userSchema, 'users');