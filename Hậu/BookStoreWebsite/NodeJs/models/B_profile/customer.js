const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    userID: String,
    email: String,
    name: String,
    phone: String,
    city: String,
    district: String,
    wards: String,
    address: String,
    typeAddress: String,

});

module.exports = mongoose.model('customers', customerSchema);