const express = require('express');
const router = express.Router();
const user = require('../../models/C_permission/user');
var passport = require('passport');
// var SocialAccount = require('../../models/C_permission/accountsocials');
var jwt = require('jsonwebtoken');
var superSecret = 'toihocmean';
//user
//get all
router.get('/', function(req, res) {
    console.log('get request for all users');
    user.find({})
        .exec(function(err, users) {
            if (err) {
                console.log("err req users");
            } else {
                res.json(users);
            }
        });
});

// get a person
router.get('/:userID', function(req, res) {
    user.findById(req.params.userID)
        .exec(function(err, users) {
            if (err) console.log("Error retrieving user");
            else res.json(users);
        });
})

// get a person by username
router.get('/email/:email', function(req, res) {
        user.find({
                email: req.params.email
            })
            .exec(function(err, users) {
                if (err) console.log("Error retrieving user");
                else res.json(users);
            });
    })
    //register
router.post('/signup', function(req, res) {
    var newuser = new user();
    newuser.email = req.body.email;
    newuser.password = req.body.password;
    newuser.username = req.body.username;
    newuser.imageUrl = "https://nulm.gov.in/images/user.png";
    newuser.role = "CUSTOMER";
    newuser.save(function(err, inserteduser) {
        if (err) {
            res.send('Err Saving user');
        } else {
            res.json(inserteduser);
        }
    });
});

//update
router.put('/:id', function(req, res) {
    user.findByIdAndUpdate(req.params.id, {
            $set: {
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                imageUrl: req.body.imageUrl,
                role: "CUSTOMER"
            }
        }, {
            new: true
        },
        function(err, updateduser) {
            if (err) {
                res.send("err Update");
            } else {
                res.json(updateduser);
            }
        })
})

//changePassword
router.put('/changePassword/:email', function(req, res) {
    user.findOne({ email: req.body.email }).select('email username password').exec(function(err, user) {
        if (err) return res.send(err);
        // set the new user information if it exists in the request 
        if (req.body.email) user.email = req.body.email;
        if (req.body.username) user.username = req.body.username;
        if (req.body.imageUrl) user.imageUrl = req.body.imageUrl;
        if (req.body.role) user.role = req.body.role;
        // if(req.body.newPassword) user.password = req.body.newPassword;
        console.log(req.body.currentPassword)
            // if(!user.comparePassword(req.body.currentPassword)){
            //     res.json({  success: false, message: 'Password was wrong!'});
            // } 
        if (!user.comparePassword(req.body.currentPassword)) {
            res.send({
                status: false,
                message: "Password was wrong!",
                obj: null,
                token: null
            });
        } else {
            if (req.body.newPassword) user.password = req.body.newPassword;
            // save the user
            user.save(function(err, user) {
                if (err) return res.send(err);
                // return a message
                res.send({
                    status: true,
                    message: "Change Password Successfully!",
                    obj: user,
                    token: null
                });
            });
        }
    });
});


//delete
router.delete('/:id', function(req, res) {
    user.findByIdAndRemove(req.params.id, function(err, deleteuser) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
});
router.get('/', isLoggedIn, function(req, res, next) {
    return res.status(200).json(req.user);
});

router.get('/profile', isLoggedIn, function(req, res) {
    res.json({ user: req.user });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return res.status(501).send(err); }
        if (!user) {
            return res.send({
                status: false,
                message: "fail"
            });
        }
        req.logIn(user, function(err) {
            if (err) { return res.status(501).send(err); }
            var account = user;
            var token = jwt.sign({
                email: account.email,
                username: account.username
            }, superSecret, {
                expiresIn: '30s' // expires in 24 hours
            });
            res.send({
                status: true,
                message: "Success",
                obj: account,
                token: token
            });
        });
    })(req, res, next);
});

// router.post('/authenticate', function(req, res) {
//     // find the user 
//     user.findOne({
//         userName: req.body.userName
//     }).select('userName password').exec(function(err, user) {
//         if (err) throw err;
//         // no user with that userName was found 
//         if (!user) {
//             res.json({
//                 success: false,
//                 message: 'Authentication failed. User not found.'
//             });
//         } else if (user) {
//             // check if password matches 
//             var validpassword = user.comparepassword(req.body.password);
//             if (!validpassword) {
//                 res.json({
//                     success: false,
//                     message: 'Authentication failed. Wrong password.'
//                 });
//             } else {
//                 // if user is found and password is right 
//                 // create a token 
//                 var token = jwt.sign({

//                     userName: user.userName
//                 }, superSecret, {
//                     expiresIn: '10p' // expires in 24 hours
//                 });
//                 res.json({
//                     success: true,
//                     message: 'Lam viec voi token!',
//                     token: token
//                 });
//             }
//         }
//     });
// });

router.get('/logout', function(req, res, next) {
    req.logout();
})

function isLoggedIn(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
module.exports = router;