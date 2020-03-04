const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    userID: String,
    nameEmp: String,
    phone: String,
    address: String,
    nickName: String,
    email: String,
    male: String,
    dateOfBirth: String,
});

module.exports = mongoose.model('employee', employeeSchema, 'employees');