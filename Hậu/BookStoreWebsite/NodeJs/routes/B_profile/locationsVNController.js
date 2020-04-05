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
router.get('/locations/cities', function(req, res) {
    console.log('get request for all cities');
    locationsVN.distinct("city")
        .exec(function(err, locationsVns) {
            if (err) {
                console.log("err req locations");
            } else {
                res.json(locationsVns);
            }
        });
});
// tra ve districts by city name (get)
router.get('/locations/districts/:city', function(req, res) {
    console.log('get request for all cities');
    locationsVN.find({
            city: req.params.city
        }).distinct("districs")
        .exec(function(err, locationsVns) {
            if (err) {
                console.log("err req locations");
            } else {
                res.json(locationsVns);
            }
        });
});
// tra ve wards by districts name and city name (get)
router.get('/locations/wards/:city/:districts', function(req, res) {
    console.log('get request for all cities');
    locationsVN.find({
            city: req.params.city,
            districs: req.params.districts
        }).distinct("wars")
        .exec(function(err, locationsVns) {
            if (err) {
                console.log("err req locations");
            } else {
                res.json(locationsVns);
            }
        });
});



// get a person
router.get('/locations/:locationsVNID', function(req, res) {
    locationsVN.findById(req.params.locationsVNID)
        .exec(function(err, locations) {
            if (err) console.log("Error retrieving locationsVN");
            else res.json(locations);
        });
})

//post
router.post('/locations', function(req, res) {
    var newlocationsVN = new locationsVN();
    newlocationsVN.userID = req.body.userID;
    newlocationsVN.name = req.body.name;
    newlocationsVN.phone = req.body.phone;
    newlocationsVN.address = req.body.address;
    newlocationsVN.email = req.body.email;
    newlocationsVN.city = req.body.city;
    newlocationsVN.districs = req.body.districts;
    newlocationsVN.wards = req.body.wards;
    newlocationsVN.typeAddress = req.body.typeAddress;
    newlocationsVN.save(function(err, insertedlocationsVN) {
        if (err) {
            console.log('Err Saving locationsVN');
        } else {
            res.json(insertedlocationsVN);
        }
    });
});


//update
router.put('/locations/:id', function(req, res) {
        locationsVN.findByIdAndUpdate(req.params.id, {
                $set: {
                    userID: req.body.userID,
                    name: req.body.name,
                    nickName: req.body.nickName,
                    phone: req.body.phone,
                    address: req.body.address,
                    email: req.body.email,
                    city: req.body.city,
                    districs: req.body.districts,
                    wards: req.body.wards,
                    typeAddress: req.body.typeAddress,

                }
            }, {
                new: true
            },
            function(err, updatedlocationsVN) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedlocationsVN);
                }
            })
    })
    //delete
router.delete('/locations/:id', function(req, res) {
    locationsVN.findByIdAndRemove(req.params.id, function(err, deletelocationsVN) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
});

module.exports = router;