const express = require('express');
const router = express.Router();
const orderDetail = require('../../models/E_payment/orderDetail');
//orderDetail
//get all
router.get('/orderDetails', function(req, res) {
    console.log('get request for all orderDetails');
    orderDetail.find({})
        .exec(function(err, orderDetails) {
            if (err) {
                console.log("err req orderDetails");
            } else {
                res.json(orderDetails);
            }
        });
});

// get a person
router.get('/orderDetails/:orderDetailID', function(req, res) {
    orderDetail.findById(req.params.orderDetailID)
        .exec(function(err, orderDetails) {
            if (err) console.log("Error retrieving orderDetail");
            else res.json(orderDetails);
        });
})

//post
router.post('/orderDetails', function(req, res) {
    var neworderDetail = new orderDetail();
    neworderDetail.orderID = req.body.orderID;
    neworderDetail.bookID = req.body.bookID;
    neworderDetail.count = req.body.count;
    neworderDetail.price = req.body.price;

    neworderDetail.save(function(err, insertedorderDetail) {
        if (err) {
            console.log('Err Saving orderDetail');
        } else {
            res.json(insertedorderDetail);
        }
    });
});


//update
router.put('/orderDetails/:id', function(req, res) {
        orderDetail.findByIdAndUpdate(req.params.id, {
                $set: {
                    orderID: req.body.orderID,
                    bookID: req.body.bookID,
                    count: req.body.count,
                    price: req.body.price,

                }
            }, {
                new: true
            },
            function(err, updatedorderDetail) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedorderDetail);
                }
            })
    })
    //delete
router.delete('/orderDetails/:id', function(req, res) {
    orderDetail.findByIdAndRemove(req.params.id, function(err, deleteorderDetail) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted'});
        }
    });
});
module.exports = router;