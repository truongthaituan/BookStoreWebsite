const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customerID: String,
    totalPrice: Number,
    orderDate: String,
    status: String,
    paymentOption: String,
    discountCode: Number,
});

module.exports = mongoose.model('orders', orderSchema);