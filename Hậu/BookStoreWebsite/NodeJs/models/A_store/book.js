 const mongoose = require('mongoose');

 const bookSchema =  mongoose.Schema({
     nameBook: String,
     categoryID: String,
     authorID: String,
     priceBook: Number,
     detailBook: String,
     tryRead: String,
     imgBook: String,
     seriID: String,
     sale: Number,
 });

 module.exports = mongoose.model('books', bookSchema);