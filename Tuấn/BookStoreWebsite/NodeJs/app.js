var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
var cors = require('cors');

app.use(cors({
    origin: ['http://localhost:4200', 'http://192.168.1.16:4200'],
    credentials: true
}));
//A_store
const book = require('./routes/A_store/bookController');
const category = require('./routes/A_store/categoryController');
const author = require('./routes/A_store/authorController');

const seri = require('./routes/A_store/seriCategory');

//B_profile
const customer = require('./routes/B_profile/customerController');
const employee = require('./routes/B_profile/employeeController');
const location = require('./routes/B_profile/locationsVNController');
//C_permission
const role = require('./routes/C_permission/roleController');
const accountSocial = require('./routes/C_permission/accountSocialController');
const user = require('./routes/C_permission/userController');
//D_action
const comment = require('./routes/D_action/commentController');
const rating = require('./routes/D_action/ratingController');
const favorite = require('./routes/D_action/favoriteController');
const checkEmail = require('./routes/D_action/checkEmailController');
//E_payment
const order = require('./routes/E_payment/orderController');
const orderDetail = require('./routes/E_payment/orderDetailController');
const sendmail = require('./routes/E_payment/sendmail');
//F_event
const discountCode = require('./routes/F_event/discountCodeController');
const promotion = require('./routes/F_event/promotionController');
//G_recommentSys
//H_tracking
//end controller
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookstore');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

require('./passport/passport-config');
//app
//A_store
app.use('/books', book);
app.use('/categories', category);
app.use('/authors', author);

app.use('/series', seri);
//B_profile
app.use('/customers', customer);
app.use('/employees', employee);
app.use('/locations', location);
//C_permission
app.use('/roles', role);
app.use('/users', user);
app.use('/socials', accountSocial);
//D_action
app.use('/comments', comment);
app.use('/favorites', favorite);
app.use('/ratings', rating);
app.use('/checkEmail', checkEmail);
//E_payment
app.use('/orders', order);
app.use('/orderDetails', orderDetail);
app.use('/send', sendmail);
//F_event
app.use('/discountCodes', discountCode);
app.use('/promotions', promotion);
//G_recommentSys
//H_tracking

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});


module.exports = app;