var mongoose = require('mongoose');
var Schema = mongoose.Schema({
        email: String,
        username: String,
        imageUrl: String,
        facebook_id: String,
        google_id: String,
        typeAccount: Number
});

module.exports = mongoose.model('accountsocials', Schema);