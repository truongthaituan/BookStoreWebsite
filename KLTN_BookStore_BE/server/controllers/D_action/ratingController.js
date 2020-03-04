const express = require('express');
const router = express.Router();
const rating = require('../../models/D_action/rating');
//rating
//get all
router.get('/ratings', function(req, res) {
    console.log('get request for all ratings');
    rating.find({})
        .exec(function(err, ratings) {
            if (err) {
                console.log("err req ratings");
            } else {
                res.json(ratings);
            }
        });
});

// get a person
router.get('/ratings/:ratingID', function(req, res) {
    rating.findById(req.params.ratingID)
        .exec(function(err, ratings) {
            if (err) console.log("Error retrieving rating");
            else res.json(ratings);
        });
})

//post
router.post('/ratings', function(req, res) {
    var newrating = new rating();
    newrating.bookID = req.body.bookID;
    newrating.userID = req.body.userID;
    newrating.star = req.body.star;

    newrating.save(function(err, insertedrating) {
        if (err) {
            console.log('Err Saving rating');
        } else {
            res.json(insertedrating);
        }
    });
});


//update
router.put('/ratings/:id', function(req, res) {
        rating.findByIdAndUpdate(req.params.id, {
                $set: {
                    bookID: req.body.bookID,
                    userID: req.body.userID,
                    star: req.body.star,

                }
            }, {
                new: true
            },
            function(err, updatedrating) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedrating);
                }
            })
    })
    //delete
router.delete('/ratings/:id', function(req, res) {
    rating.findByIdAndRemove(req.params.id, function(err, deleterating) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json(deleterating);
        }
    });
});
module.exports = router;