const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customerID: String,
    totalPrice: Number,
    orderDate: String,
    status: String,
    paymentOption: String,
});

module.exports = mongoose.model('orders', orderSchema);