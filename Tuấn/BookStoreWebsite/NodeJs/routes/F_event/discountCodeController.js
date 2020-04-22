const express = require('express');
const router = express.Router();
const discountCode = require('../../models/F_event/discountCode');
//discountCode
//get all
router.get('/', function(req, res) {
    console.log('get request for all discountCodes');
    discountCode.find({})
        .exec(function(err, discountCodes) {
            if (err) {
                console.log("err req discountCodes");
            } else {
                res.json(discountCodes);
            }
        });
});

// get a person
router.get('/:discountCodeID', function(req, res) {
    discountCode.findById(req.params.discountCodeID)
        .exec(function(err, discountCodes) {
            if (err) console.log("Error retrieving discountCode");
            else res.json(discountCodes);
        });
})

//post
router.post('/', function(req, res) {
    var newdiscountCode = new discountCode();
    newdiscountCode.discountDetail = req.body.discountDetail;
    newdiscountCode.dateStart = req.body.dateStart;
    newdiscountCode.dateEnd = req.body.dateEnd;
    newdiscountCode.check = req.body.check;
    newdiscountCode.discount = req.body.discount;

    newdiscountCode.save(function(err, inserteddiscountCode) {
        if (err) {
            console.log('Err Saving discountCode');
        } else {
            res.json(inserteddiscountCode);
        }
    });
});


//update
router.put('/:id', function(req, res) {
        discountCode.findByIdAndUpdate(req.params.id, {
                $set: {
                    discountDetail: req.body.discountDetail,
                    dateStart: req.body.dateStart,
                    dateEnd: req.body.dateEnd,
                    check: req.body.check,
                    discount: req.body.discount,

                }
            }, {
                new: true
            },
            function(err, updateddiscountCode) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updateddiscountCode);
                }
            })
    })
    //delete
router.delete('/:id', function(req, res) {
    discountCode.findByIdAndRemove(req.params.id, function(err, deletediscountCode) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
});
module.exports = router;