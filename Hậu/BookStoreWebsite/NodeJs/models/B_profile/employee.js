const mongoose = require('mongoose');

const employeeSchema =  mongoose.Schema({
    userID: String,
    nameEmp: String,
    phone: String,
    address: String,
    nickName: String,
    email: String,
    male: String,
    dateOfBirth: String,
});

module.exports = mongoose.model('employees', employeeSchema);