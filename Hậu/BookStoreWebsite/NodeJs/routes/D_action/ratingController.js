const express = require('express');
const router = express.Router();
const rating = require('../../models/D_action/rating');
//rating
//get all
router.get('/', function(req, res) {
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
router.get('/:ratingID', function(req, res) {
    rating.findById(req.params.ratingID)
        .exec(function(err, ratings) {
            if (err) console.log("Error retrieving rating");
            else res.json(ratings);
        });
})

//post
router.post('/', function(req, res) {
    var newrating = new rating();
    newrating.bookID = req.body.bookID;
    newrating.userID = req.body.userID;
    newrating.star = req.body.star;
    newrating.review = req.body.review;
    newrating.save(function(err, insertedrating) {
        if (err) {
            console.log('Err Saving rating');
        } else {
            res.json(insertedrating);
        }
    });
});


//update
router.put('/:id', function(req, res) {
        async function run() {
            const update = putRate(req.params.id, req, res)
            res.json(update);
        }
        run();
    })
    //delete
router.delete('/:id', function(req, res) {
    rating.findByIdAndRemove(req.params.id, function(err, deleterating) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
});
//find all rating by bookID
router.get('/findbooks/:book_id', function(req, res) {
    rating.find({
            bookID: req.params.book_id
        })
        .exec(function(err, ratings) {
            if (err) console.log("Error retrieving rating");
            else
                res.json(ratings);
        });
})

router.post('/RatingBookByUserID', function(req, res) {
    async function run() {
        const rateFind = await findRatingByUserIDAndBookID(req, res);
        res.json(rateFind);
    }
    run();
})
async function findRatingByUserIDAndBookID(req, res) {

    try {
        const rate = await rating.find({
            userID: req.body.userID,
            bookID: req.body.bookID
        });
        // console.log(customerArray)
        return rate;
    } catch (err) {
        return res.status(501).json(err);
    }
};
async function putRate(idRate, req, res) {

    try {
        const rateUpdate = await rating.findByIdAndUpdate(idRate, {
            $set: {
                bookID: req.body.bookID,
                userID: req.body.userID,
                star: req.body.star,
                review: req.body.review
            }
        }, {
            new: true
        });
        // console.log(customerArray)
        return rateUpdate;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//update rating by UserID
router.post('/UpdateRating', function(req, res) {
    async function run() {
        console.log("UpdateRat2ing")
        const rateFind = await findRatingByUserIDAndBookID(req, res);
        console.log(rateFind)
        console.log(rateFind[0]._id)

        console.log("vaoo")
        const update = await putRate(rateFind[0]._id, req, res)
        res.json(update)

    }
    run();
})

//Average Rating By bookID
router.get('/averageRating/:book_id', function(req, res) {
    async function run() {
        const listRate = await getRateByBookID(req, res)
        let total = parseFloat(0)
        for (let index in listRate) {
            total = total + parseFloat(listRate[index].star)
        }
        let average = Math.round(2 * (total / listRate.length)) / 2;
        res.json({ average: average, count: listRate.length })
    }
    run()
})

async function getRateByBookID(req, res) {
    try {
        const listRate = await rating.find({
            bookID: req.params.book_id
        })
        return listRate
    } catch (error) {
        return res.status(501).json(err);
    }
}


module.exports = router;