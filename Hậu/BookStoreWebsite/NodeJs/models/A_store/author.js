const mongoose = require('mongoose');

const authorSchema =  mongoose.Schema({
    nameAuthor: String
});

module.exports = mongoose.model('authors', authorSchema);