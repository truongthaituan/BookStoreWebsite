const express = require('express');
const router = express.Router();
const favorite = require('../../models/D_action/favorite');
//favorite
//get all
router.get('/', function(req, res) {
    console.log('get request for all favorites');
    favorite.find({})
        .exec(function(err, favorites) {
            if (err) {
                console.log("err req favorites");
            } else {
                res.json(favorites);
            }
        });
});


// get a person
router.get('/:favoriteID', function(req, res) {
    favorite.findById(req.params.favoriteID)
        .exec(function(err, favorites) {
            if (err) console.log("Error retrieving favorite");
            else res.json(favorites);
        });
})

//post
router.post('/', function(req, res) {
    var newfavorite = new favorite();
    newfavorite.bookID = req.body.bookID;
    newfavorite.userID = req.body.userID;

    newfavorite.save(function(err, insertedfavorite) {
        if (err) {
            console.log('Err Saving favorite');
        } else {
            res.json(insertedfavorite);
        }
    });
});


//update
router.put('/:id', function(req, res) {
        favorite.findByIdAndUpdate(req.params.id, {
                $set: {
                    bookID: req.body.bookID,
                    userID: req.body.userID,

                }
            }, {
                new: true
            },
            function(err, updatedfavorite) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedfavorite);
                }
            })
    })
    //delete
router.delete('/:id', function(req, res) {
    favorite.findByIdAndRemove(req.params.id, function(err, deletefavorite) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
});
module.exports = router;