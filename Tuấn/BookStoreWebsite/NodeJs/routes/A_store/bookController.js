const express = require('express');
const router = express.Router();
const book = require('../../models/A_store/book');


//book
//get all
router.get('/books', function(req, res) {
    console.log('get request for all books');
    book.find({})
        .exec(function(err, books) {
            if (err) {
                console.log("err req books");
            } else {
                res.json(books);
            }
        });
});


// get a person
router.get('/books/:bookID', function(req, res) {
    book.findById(req.params.bookID)
        .exec(function(err, books) {
            if (err) console.log("Error retrieving book");
            else res.json(books);
        });
})


//post
router.post('/books', function(req, res) {
    var newbook = new book();
    newbook.nameBook = req.body.nameBook;
    newbook.categoryID = req.body.categoryID;
    newbook.authorID = req.body.authorID;
    newbook.priceBook = req.body.priceBook;
    newbook.detailBook = req.body.detailBook;
    newbook.imgBook = req.body.imgBook;
    newbook.seriID = req.body.seriID;
    newbook.sale = req.body.sale;
    newbook.save(function(err, insertedbook) {
        if (err) {
            console.log('Err Saving book');
        } else {
            res.json(insertedbook);
        }
    });
});


//update
router.put('/books/:id', function(req, res) {
        book.findByIdAndUpdate(req.params.id, {
                $set: {
                    nameBook: req.body.nameBook,
                    categoryID: req.body.categoryID,
                    authorID: req.body.authorID,
                    priceBook: req.body.priceBook,
                    detailBook: req.body.detailBook,
                    imgBook: req.body.imgBook,
                    seriID: req.body.seriID,
                    sale: req.body.sale,
                }
            }, {
                new: true
            },
            function(err, updatedbook) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedbook);
                }
            })
    })
    //delete
router.delete('/books/:id', function(req, res) {
    book.findByIdAndRemove(req.params.id, function(err, deletebook) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted'});
        }
    });
});
module.exports = router;