const express = require('express');
const router = express.Router();
var SocialAccount = require('../../models/C_permission/accountsocials');

//user
//get all
router.get('/socials', function(req, res) {
    console.log('get request for all users');
    SocialAccount.find({})
        .exec(function(err, SocialAccount) {
            if (err) {
                console.log("err req users");
            } else {
                res.json(SocialAccount);
            }
        });
});

// get a person
router.get('/socials/:userID', function(req, res) {
    SocialAccount.findById(req.params.userID)
        .exec(function(err, SocialAccount) {
            if (err) console.log("Error retrieving user");
            else res.json(SocialAccount);
        });
})


module.exports = router;