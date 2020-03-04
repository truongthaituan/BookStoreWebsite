const express = require('express');
const router = express.Router();
const order = require('../../models/E_payment/order');
//order
//get all
router.get('/orders', function(req, res) {
    console.log('get request for all orders');
    order.find({})
        .exec(function(err, orders) {
            if (err) {
                console.log("err req orders");
            } else {
                res.json(orders);
            }
        });
});

// get a person
router.get('/orders/:orderID', function(req, res) {
    order.findById(req.params.orderID)
        .exec(function(err, orders) {
            if (err) console.log("Error retrieving order");
            else res.json(orders);
        });
})

//post
router.post('/orders', function(req, res) {
    var neworder = new order();
    neworder.customerID = req.body.customerID;
    neworder.totalPrice = req.body.totalPrice;
    neworder.orderDate = req.body.orderDate;

    neworder.save(function(err, insertedorder) {
        if (err) {
            console.log('Err Saving order');
        } else {
            res.json(insertedorder);
        }
    });
});


//update
router.put('/orders/:id', function(req, res) {
        order.findByIdAndUpdate(req.params.id, {
                $set: {
                    customerID: req.body.customerID,
                    totalPrice: req.body.totalPrice,
                    orderDate: req.body.orderDate,

                }
            }, {
                new: true
            },
            function(err, updatedorder) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedorder);
                }
            })
    })
    //delete
router.delete('/orders/:id', function(req, res) {
    order.findByIdAndRemove(req.params.id, function(err, deleteorder) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json(deleteorder);
        }
    });
});
module.exports = router;