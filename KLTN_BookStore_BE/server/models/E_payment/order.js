const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customerID: String,
    totalPrice: Number,
    orderDate: String,

});

module.exports = mongoose.model('order', orderSchema, 'orders');