const mongoose = require('mongoose');

const discountCodeSchema = mongoose.Schema({
    userID: String,
    discountCode: Number,
    discountDetail: String

});

module.exports = mongoose.model('discountCodes', discountCodeSchema);