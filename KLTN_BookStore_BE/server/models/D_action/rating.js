const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    bookID: String,
    userID: String,
    star: Number,

});

module.exports = mongoose.model('rating', ratingSchema, 'ratings');