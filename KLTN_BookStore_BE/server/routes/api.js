const express = require('express');
// const router = express.Router();
const mongoose = require('mongoose');
//Controller
//A_store
const book = require('../controllers/A_store/bookController');
const category = require('../controllers/A_store/categoryController');
const author = require('../controllers/A_store/authorController');

const seri = require('../controllers/A_store/seriCategory');

//B_profile
const customer = require('../controllers/B_profile/customerController');
const employee = require('../controllers/B_profile/employeeController');

//C_permission
const role = require('../controllers/C_permission/roleController');
const user = require('../controllers/C_permission/userController');
//D_action
const comment = require('../controllers/D_action/commentController');
const rating = require('../controllers/D_action/ratingController');
const favorite = require('../controllers/D_action/favoriteController');

//E_payment
const order = require('../controllers/E_payment/orderController');
const orderDetail = require('../controllers/E_payment/orderDetailController');
//F_event
const discountCode = require('../controllers/F_event/discountCodeController');
const promotion = require('../controllers/F_event/promotionController');
//G_recommentSys
//H_tracking
//end controller
var app = express();
mongoose.set('createIndexes', true);
mongoose.connect('mongodb://localhost:27017/dbBook', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//app
//A_store
app.use('/', book);
app.use('/', category);
app.use('/', author);

app.use('/', seri);
//B_profile
app.use('/', customer);
app.use('/', employee);
//C_permission
app.use('/', role);
app.use('/', user);
//D_action
app.use('/', comment);
app.use('/', favorite);
app.use('/', rating);
//E_payment
app.use('/', order);
app.use('/', orderDetail);
//F_event
app.use('/', discountCode);
app.use('/', promotion);
//G_recommentSys
//H_tracking
module.exports = app;