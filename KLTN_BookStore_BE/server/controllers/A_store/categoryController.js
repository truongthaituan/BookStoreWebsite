const express = require('express');
const router = express.Router();
const category = require('../../models/A_store/category');
//category
//get all
router.get('/categories', function(req, res) {
    console.log('get request for all categories');
    category.find({})
        .exec(function(err, categories) {
            if (err) {
                console.log("err req categories");
            } else {
                res.json(categories);
            }
        });
});

// get a person
router.get('/categories/:categoryID', function(req, res) {
    category.findById(req.params.categoryID)
        .exec(function(err, categories) {
            if (err) console.log("Error retrieving category");
            else res.json(categories);
        });
})

//post
router.post('/categories', function(req, res) {
    var newcategory = new category();
    newcategory.nameCategory = req.body.nameCategory;

    newcategory.save(function(err, insertedcategory) {
        if (err) {
            console.log('Err Saving category');
        } else {
            res.json(insertedcategory);
        }
    });
});


//update
router.put('/categories/:id', function(req, res) {
        category.findByIdAndUpdate(req.params.id, {
                $set: {
                    nameCategory: req.body.nameCategory,
                }
            }, {
                new: true
            },
            function(err, updatedcategory) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedcategory);
                }
            })
    })
    //delete
router.delete('/categories/:id', function(req, res) {
    category.findByIdAndRemove(req.params.id, function(err, deletecategory) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json(deletecategory);
        }
    });
});
module.exports = router;