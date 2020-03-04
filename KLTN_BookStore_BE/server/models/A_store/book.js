 const mongoose = require('mongoose');

 const Schema = mongoose.Schema;

 const bookSchema = new Schema({
     nameBook: String,
     categoryID: String,
     authorID: String,
     priceBook: Number,
     detailBook: String,
     imgBook: String,
     seriID: String,
     sale: Number,
 });

 module.exports = mongoose.model('book', bookSchema, 'books');