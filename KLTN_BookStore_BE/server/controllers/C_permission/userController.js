const express = require('express');
const router = express.Router();
const user = require('../../models/C_permission/user');
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

//post
router.post('/users', function(req, res) {
    var newuser = new user();
    newuser.userName = req.body.userName;
    newuser.password = req.body.password;
    newuser.roleID = req.body.roleID;

    newuser.save(function(err, inserteduser) {
        if (err) {
            console.log('Err Saving user');
        } else {
            res.json(inserteduser);
        }
    });
});


//update
router.put('/users/:id', function(req, res) {
        user.findByIdAndUpdate(req.params.id, {
                $set: {
                    userName: req.body.userName,
                    password: req.body.password,
                    roleID: req.body.roleID,

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
            res.json(deleteuser);
        }
    });
});

//login && authenticate
// router.post('/authenticate', function(req, res) {
//     //find the user
//     user.findOne({
//         userName: req.body.userName
//     }).select('name userName password').exec(function(err, user) {

//         if (err) throw err;
//         //no user with userName was found
//         if (!user) {
//             res.json({
//                 success: false,
//                 message: 'Authentication failed. Wrong password.'
//             });
//         } else if (user) {
//             //check if password matches
//             var validpassword = user.comparepassword(req.body.password);
//             if (!validpassword) {
//                 res.json({
//                     success: false,
//                     message: 'Authentication failed .Wrong password.'
//                 });
//             } else {
//                 var token = jwt.sign({
//                     userName: user.userName

//                 }, superSecret, {
//                     expiresIn: '10s' //express in 24h
//                 });
//             }
//         }
//     });
// })



router.post('/authenticate', function(req, res) {
    // find the user 
    user.findOne({
        userName: req.body.userName
    }).select('userName password').exec(function(err, user) {
        if (err) throw err;
        // no user with that userName was found 
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            // check if password matches 
            var validpassword = user.comparepassword(req.body.password);
            if (!validpassword) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {
                // if user is found and password is right 
                // create a token 
                var token = jwt.sign({

                    userName: user.userName
                }, superSecret, {
                    expiresIn: '10p' // expires in 24 hours
                });
                res.json({
                    success: true,
                    message: 'Lam viec voi token!',
                    token: token
                });
            }
        }
    });
});
module.exports = router;