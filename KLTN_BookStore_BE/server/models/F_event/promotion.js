const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const promotionSchema = new Schema({
    detailPromotion: String,
    discount: Number,
    ifDiscount: Number,
    startDate: String,
    endDate: String,

});

module.exports = mongoose.model('promotion', promotionSchema, 'promotions');