const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    bookID: String,
    userID: String,
    commentDate: String,
    time: String,
    content: String,
});

module.exports = mongoose.model('comment', commentSchema, 'comments');