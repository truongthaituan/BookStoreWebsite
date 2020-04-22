const mongoose = require('mongoose');

const locationsVNSchema = mongoose.Schema({
    city: String,
    districs: String,
    wars: String,
});

module.exports = mongoose.model('locations', locationsVNSchema);