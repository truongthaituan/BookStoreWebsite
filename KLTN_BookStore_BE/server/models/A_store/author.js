const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    nameAuthor: String,
    detailAuthor: String,
    imgAuthor: String,

});

module.exports = mongoose.model('author', authorSchema, 'authors');