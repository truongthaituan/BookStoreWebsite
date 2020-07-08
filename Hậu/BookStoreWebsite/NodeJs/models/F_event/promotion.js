const mongoose = require('mongoose');
const promotionSchema = mongoose.Schema({
    detailPromotion: String,
    discount: Number,
    ifDiscount: Number,
    startDate: String,
    endDate: String,
    listBookIn: Object,
    isShow: String,
});

module.exports = mongoose.model('promotions', promotionSchema);