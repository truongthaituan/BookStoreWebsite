const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roleSchema = new Schema({
    nameRole: String,
});

module.exports = mongoose.model('role', roleSchema, 'roles');