const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    userID: String,
    name: String,
    nickName: String,
    phone: String,
    address: String,
    email: String,
});

module.exports = mongoose.model('customer', customerSchema, 'customers');