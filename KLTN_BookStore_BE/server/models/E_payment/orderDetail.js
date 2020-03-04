const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
    orderID: String,
    bookID: String,
    count: Number,
    price: Number,

});

module.exports = mongoose.model('orderDetail', orderDetailSchema, 'orderDetails');