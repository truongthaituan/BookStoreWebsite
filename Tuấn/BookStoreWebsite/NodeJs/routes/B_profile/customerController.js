const express = require('express');
const router = express.Router();
const customer = require('../../models/B_profile/customer')
    //customer
    //get all
router.get('/', function(req, res) {
    console.log('get request for all customers');
    customer.find({})
        .exec(function(err, customers) {
            if (err) {
                console.log("err req customers");
            } else {
                res.json(customers);
            }
        });
});

// get a person
router.get('/:customerID', function(req, res) {
    customer.findById(req.params.customerID)
        .exec(function(err, customers) {
            if (err) console.log("Error retrieving customer");
            else res.json(customers);
        });
})

//post
router.post('/', function(req, res) {
    var newcustomer = new customer();
    newcustomer.userID = req.body.userID;
    newcustomer.name = req.body.name;
    newcustomer.phone = req.body.phone;
    newcustomer.address = req.body.address;
    newcustomer.email = req.body.email;
    newcustomer.city = req.body.city;
    newcustomer.districts = req.body.districts;
    newcustomer.wards = req.body.wards;
    newcustomer.typeAddress = req.body.typeAddress;
    newcustomer.save(function(err, insertedcustomer) {
        if (err) {
            console.log('Err Saving customer');
        } else {
            res.json(insertedcustomer);
        }
    });
});


//update
router.put('/:id', function(req, res) {
        customer.findByIdAndUpdate(req.params.id, {
                $set: {
                    userID: req.body.userID,
                    name: req.body.name,
                    nickName: req.body.nickName,
                    phone: req.body.phone,
                    address: req.body.address,
                    email: req.body.email,
                    city: req.body.city,
                    districts: req.body.districts,
                    wards: req.body.wards,
                    typeAddress: req.body.typeAddress,

                }
            }, {
                new: true
            },
            function(err, updatedcustomer) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedcustomer);
                }
            })
    })
    //delete
router.delete('/:id', function(req, res) {
    customer.findByIdAndRemove(req.params.id, function(err, deletecustomer) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
});
//get customer by userid
router.get('/UserID/:user_id', function(req, res) {
    customer.find({
            userID: req.params.user_id
        })
        .exec(function(err, customers) {
            if (err) console.log("Error retrieving customer");
            else res.json(customers);
        });
})
module.exports = router;