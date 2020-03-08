const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customerID: String,
    totalPrice: Number,
    orderDate: String,

});

module.exports = mongoose.model('orders', orderSchema);