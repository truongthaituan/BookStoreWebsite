const mongoose = require('mongoose');

const discountCodeSchema = mongoose.Schema({
    discountDetail: String,
    dateStart: String,
    dateEnd: String,
    check: Boolean,
    discount: Number,
});

module.exports = mongoose.model('discountCodes', discountCodeSchema);