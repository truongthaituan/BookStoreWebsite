const mongoose = require('mongoose');

const datasetRecommendSchema = mongoose.Schema({
    bookID: String,
    userID: String,
    rate: String,
    buy: String,
    click: String,
});

module.exports = mongoose.model('datasetRecommends', datasetRecommendSchema);