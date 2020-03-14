const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    bookID: String,
    userID: String,
    star: String,
    review: String
});

module.exports = mongoose.model('ratings', ratingSchema);