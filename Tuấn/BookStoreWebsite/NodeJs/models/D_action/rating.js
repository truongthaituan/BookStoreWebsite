const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    bookID: String,
    userID: String,
    star: Number,

});

module.exports = mongoose.model('ratings', ratingSchema);