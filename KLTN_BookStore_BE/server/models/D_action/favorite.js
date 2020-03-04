const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    bookID: String,
    userID: String,
});

module.exports = mongoose.model('favorite', favoriteSchema, 'favorites');