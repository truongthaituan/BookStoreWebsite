const express = require('express');
const router = express.Router();
const user = require('../../models/C_permission/user');
var passport = require('passport');
var SocialAccount = require('../../models/C_permission/accountsocials');
var jwt = require('jsonwebtoken');
var superSecret = 'toihocmean';
//user
//get all
router.get('/users', function(req, res) {
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
router.get('/users/:userID', function(req, res) {
    user.findById(req.params.userID)
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
router.put('/users/:id', function(req, res) {
        user.findByIdAndUpdate(req.params.id, {
                $set: {
                    email: req.body.email,
                    password: req.body.password,
                    username: req.body.username,
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
    //delete
router.delete('/users/:id', function(req, res) {
    user.findByIdAndRemove(req.params.id, function(err, deleteuser) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted'});
        }
    });
});
router.get('/users',isLoggedIn,function(req,res,next){
    return res.status(200).json(req.user);
  });
  
  router.get('/profile', isLoggedIn, function(req, res){
    res.json({ user: req.user });
  });
  
router.post('/login',function(req,res,next){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.status(501).send(err); }
      if (!user) { return res.send({  
                status: false,
                message: "fail"
            }); }
         req.logIn(user, function(err) {
        if (err) { return res.status(501).send(err); }
        var account = user;
        var token = jwt.sign({
          email: account.email,
          username: account.username
          }, superSecret, {
          expiresIn: '24h' // expires in 24 hours
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

router.post('/social/facebook', (req, res) => {
    SocialAccount.findOne({facebook_id: req.body.facebook_id}).exec((err, doc) => {
        if(err){
            res.json({
                status: false,
                message: "Error in retriving Account: " + 
                JSON.stringify(err, undefined, 2)
            });
        }
        else if(!doc){
            res.json({
                status: false
            });
        }
        else{
            var SocialAccount = doc;
            var token = jwt.sign({   
            
              username: SocialAccount.username 
              }, superSecret, {
              expiresIn: '1h' // expires in 24 hours
              });   
            res.json({
                status: true,
                message: "Success", 
                obj: SocialAccount,
                token: token
            });
        }
    });
  });

router.post('/social/google', (req, res) => {
    SocialAccount.findOne({google_id: req.body.google_id}).exec((err, doc) => {
        if(err){
            res.json({
                status: false,
                message: "Error in retriving Account: " + 
                JSON.stringify(err, undefined, 2)
            });
        }
        else if(!doc){
            res.json({
                status: false
            });
        }
        else{
            var socialAccount = doc;
            // var token = jwt.sign({
            //   email: socialAccount.email,
            //   username: socialAccount.username
            //   }, superSecret, {
            //   expiresIn: '1h' // expires in 24 hours
            //   });   
                res.json({
                status: true,
                message: "Success", 
                obj: socialAccount
                // token: token
            });
        }
    });
  });

router.post('/addAccount', (req, res) => {
    var socialAccount = new SocialAccount({
        email: req.body.email,
        username: req.body.username,
        imageUrl: req.body.imageUrl,
        facebook_id: req.body.facebook_id,
        google_id: req.body.google_id,
        role: "CUSTOMER"
    });
    SocialAccount.collection.insertOne(socialAccount, (err, data) => {
        if(err){
            res.json({
                status: false,
                message: err,
                obj: null
            });
        }
        else{
            res.json({
                status: true,
                message: "Insert Successfully!",
                obj: socialAccount
            });
        }
    })
  });
router.get('/logout', function(req,res,next){
    req.logout();
  })
  function isLoggedIn(req, res, next) {
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
  }
module.exports = router;