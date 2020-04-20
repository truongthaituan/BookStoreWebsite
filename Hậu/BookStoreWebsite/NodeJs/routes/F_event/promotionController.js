const express = require('express');
const router = express.Router();
const promotion = require('../../models/F_event/promotion');
//promotion
//get all
router.get('/', function(req, res) {
    console.log('get request for all promotions');
    promotion.find({})
        .exec(function(err, promotions) {
            if (err) {
                console.log("err req promotions");
            } else {
                res.json(promotions);
            }
        });
});

// get a person
router.get('/:promotionID', function(req, res) {
    promotion.findById(req.params.promotionID)
        .exec(function(err, promotions) {
            if (err) console.log("Error retrieving promotion");
            else res.json(promotions);
        });
})

//post
router.post('/', function(req, res) {
    var newpromotion = new promotion();
    newpromotion.detailPromotion = req.body.detailPromotion;
    newpromotion.discount = req.body.discount;
    newpromotion.ifDiscount = req.body.ifDiscount;
    newpromotion.startDate = req.body.startDate;
    newpromotion.endDate = req.body.endDate;

    newpromotion.save(function(err, insertedpromotion) {
        if (err) {
            console.log('Err Saving promotion');
        } else {
            res.json(insertedpromotion);
        }
    });
});


//update
router.put('/:id', function(req, res) {
        promotion.findByIdAndUpdate(req.params.id, {
                $set: {
                    detailPromotion: req.body.detailPromotion,
                    discount: req.body.discount,
                    ifDiscount: req.body.ifDiscount,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,

                }
            }, {
                new: true
            },
            function(err, updatedpromotion) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedpromotion);
                }
            })
    })
    //delete
router.delete('/:id', function(req, res) {
    promotion.findByIdAndRemove(req.params.id, function(err, deletepromotion) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
});
module.exports = router;