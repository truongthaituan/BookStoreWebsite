const express = require('express');
const router = express.Router();
const locationsVN = require('../../models/B_profile/locationsVN');
const book = require('../../models/A_store/book');
//locationsVN
//get all
router.get('/locations', function(req, res) {
    console.log('get request for all locations');
    locationsVN.find({})
        .exec(function(err, locationsVns) {
            if (err) {
                console.log("err req locations");
            } else {
                res.json(locationsVns);
            }
        });
});

// get all city  (get)

// tra ve districs by city name (post)
// tra ve wards by districs name and city name (post)


module.exports = router;