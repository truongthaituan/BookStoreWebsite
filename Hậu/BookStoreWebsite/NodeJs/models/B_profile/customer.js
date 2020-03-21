const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    userID: String,
    name: String,
    nickName: String,
    phone: String,
    address: String,
    email: String,
});

module.exports = mongoose.model('customers', customerSchema);