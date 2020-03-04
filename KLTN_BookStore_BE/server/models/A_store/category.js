const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    cameCategory: String,
});

module.exports = mongoose.model('category', categorySchema, 'categories');