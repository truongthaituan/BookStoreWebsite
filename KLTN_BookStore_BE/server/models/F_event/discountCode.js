const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const discountCodeSchema = new Schema({
    discountDetail: String,
    dateStart: String,
    dateEnd: String,
    check: Boolean,
    discount: Number,
});

module.exports = mongoose.model('discountCode', discountCodeSchema, 'discountCodes');