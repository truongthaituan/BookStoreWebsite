const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const seriSchema = new Schema({

    seriName: String,
    seriDetail: String,
    seriImg: String,


});

module.exports = mongoose.model('seri', seriSchema, 'series');