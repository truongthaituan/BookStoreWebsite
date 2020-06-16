var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var superSecret = 'toihocmean';
var app = express();
var cors = require('cors');
const jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');
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
const cartBook = require('./routes/D_action/cartBookController');
const point = require('./routes/D_action/pointController');
//E_payment
const order = require('./routes/E_payment/orderController');
const orderDetail = require('./routes/E_payment/orderDetailController');
const sendmail = require('./routes/E_payment/sendmail');
//F_event
const discountCode = require('./routes/F_event/discountCodeController');
const promotion = require('./routes/F_event/promotionController');
//G_statistic
const statistic = require('./routes/G_statistic/statisticController');
const dataset = require('./routes/G_statistic/datasetControleer');
//H_recommend
const dataset_recommend = require('./routes/H_recommend/dataset_Recommend')
const datasetRecommend = require('./routes/H_recommend/all_RecommendSys')
    //I_best
const best_selling = require('./routes/I_best/best_Selling');
//end controller
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(cors({
    origin: ['http://localhost:4200', 'http://192.168.1.16:4200'],
    credentials: true
}));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

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

//ALLOW PATHS WITHOUT TOKEN AUTHENTICATION
app.use(expressJWT({ secret: superSecret })
    .unless({
        path: [
            '/users/login',
            '/users/signup',
            /^\/books.*/,
            /^\/categories.*/,
            /^\/authors.*/,
            /^\/series.*/,
            /^\/socials.*/,
            /^\/users.*/,
            /^\/cartBooks.*/,
            /^\/points.*/,
            /^\/discountCodes.*/,
            /^\/best_selling.*/,
            '/socials/google',
            '/socials/facebook',
            '/addAccount',
            {
                url: /^\/ratings.*/,
                methods: ['GET']
            }

        ]
    }, {
        path: [{
            url: /^\/categories.*/,
            methods: ['GET']
        }]
    }));
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
app.use('/cartBooks', cartBook);
app.use('/points', point);
//E_payment
app.use('/orders', order);
app.use('/orderDetails', orderDetail);
app.use('/send', sendmail);
//F_event
app.use('/discountCodes', discountCode);
app.use('/promotions', promotion);
//G_statistic
app.use('/statistic', statistic);
app.use('/data', dataset);
//H_recommend
app.use('/dataset_recommend', dataset_recommend)
app.use('/datasetRecommend', datasetRecommend)
    //I_best

app.use('/best_selling', best_selling)
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