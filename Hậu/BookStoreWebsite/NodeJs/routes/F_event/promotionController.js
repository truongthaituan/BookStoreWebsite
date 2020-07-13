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
    newpromotion.headerPromotion = req.body.headerPromotion;
    newpromotion.imgPromotion = req.body.imgPromotion;
    newpromotion.detailPromotion = req.body.detailPromotion;
    newpromotion.discount = req.body.discount;
    newpromotion.ifDiscount = req.body.ifDiscount;
    newpromotion.startDate = req.body.startDate;
    newpromotion.endDate = req.body.endDate;
    newpromotion.listBookIn = req.body.listBookIn;
    newpromotion.isShow = req.body.isShow;
    newpromotion.StatusUpdateBookSale = "NotUse"
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
                    headerPromotion: req.body.headerPromotion,
                    imgPromotion: req.body.imgPromotion,
                    detailPromotion: req.body.detailPromotion,
                    discount: req.body.discount,
                    ifDiscount: req.body.ifDiscount,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    listBookIn: req.body.listBookIn,
                    isShow: req.body.isShow,
                    StatusUpdateBookSale: req.body.StatusUpdateBookSale,

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



router.get('/Top3/3PromotionShow', function(req, res) {
    
    async function run() {

        var Listmonth = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" }
        var now = new Date();
        var nowSplit = now.toString().split(" ") //hiện tại  
        var nowDate=""
        nowDate = nowSplit[3] + "-" + Listmonth[nowSplit[1]] + "-" + nowSplit[2] + " " + nowSplit[4].split(":")[0] + ":" + nowSplit[4].split(":")[1] 

        const AllPromotion = await getAll()
        ThreePromotion = []
        for (let index of AllPromotion) {
            if (index.isShow == "true") {   //duoc phep hien thi
                  //kiểm tra hiện tại so với bắt đầu và kết thúc
                if(Date.parse(index.startDate)<=Date.parse(nowDate) && Date.parse(index.endDate)>=Date.parse(nowDate))
                {
                    ThreePromotion.push(index)
                }
            }
            if (ThreePromotion.length == 3) break
        }
        res.json(ThreePromotion)
    }
    run()
});

//get all
async function getAll() {
    const listPromotion = await promotion.find({})
    return listPromotion
}
module.exports = router;