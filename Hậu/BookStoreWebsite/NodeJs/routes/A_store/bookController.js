const express = require('express');
const router = express.Router();
const book = require('../../models/A_store/book');
const user = require('../../routes/C_permission/userController')
const { checkRole } = require("../utils/Auth")


//book
//get all
router.get('/', function(req, res) {
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
router.get('/:bookID', function(req, res) {
    book.findById(req.params.bookID)
        .exec(function(err, books) {
            if (err) console.log("Error retrieving book");
            else res.json(books);
        });
})


//post
router.post('/', checkRole(["ADMIN"]), function(req, res) {
    if (req.body.sale == null || req.body.sale == "") req.body.sale = 0
    var newbook = new book();
    newbook.nameBook = req.body.nameBook;
    newbook.categoryID = req.body.categoryID;
    newbook.authorID = req.body.authorID;
    newbook.priceBook = req.body.priceBook;
    newbook.detailBook = req.body.detailBook;
    newbook.tryRead = req.body.tryRead;
    newbook.imgBook = req.body.imgBook;
    newbook.seriID = req.body.seriID;
    newbook.sale = req.body.sale;
    newbook.quantity = 100;
    newbook.rate = 0;
    newbook.save(function(err, insertedbook) {
        if (err) {
            console.log('Err Saving book');
        } else {
            res.json(insertedbook);
        }
    });
});


//update
router.put('/:id', checkRole(["ADMIN"]), function(req, res) {
        if (req.body.sale == null || req.body.sale == "") req.body.sale = 0
        book.findByIdAndUpdate(req.params.id, {

                $set: {
                    nameBook: req.body.nameBook,
                    categoryID: req.body.categoryID,
                    authorID: req.body.authorID,
                    priceBook: req.body.priceBook,
                    detailBook: req.body.detailBook,
                    tryRead: req.body.tryRead,
                    imgBook: req.body.imgBook,
                    seriID: req.body.seriID,
                    sale: req.body.sale,
                    quantity: req.body.quantity,

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
router.delete('/:id', checkRole(["ADMIN"]), function(req, res) {
    book.findByIdAndRemove(req.params.id, function(err, deletebook) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
});
//get book by category
router.get('/findbycategory/:category_id', function(req, res) {
        book.find({
                categoryID: req.params.category_id
            })
            .exec(function(err, books) {
                if (err) console.log("Error retrieving books");
                else { res.json(books); }
            });
    })
    //get book by category
router.get('/findbyauthor/:author_id', function(req, res) {
        book.find({
                authorID: req.params.author_id
            })
            .exec(function(err, books) {
                if (err) console.log("Error retrieving books");
                else { res.json(books); }
            });
    })
    //get book by price
router.post('/price', function(req, res) {
    book.find({
            priceBook: { $gte: req.body.price1, $lte: req.body.price2 }
        })
        .exec(function(err, books) {
            if (err) console.log("Error retrieving books");
            else { res.json(books); }
        });
})
router.post('/filter', function(req, res) {

    book.find({})
        .exec(function(err, books) {
            // let booksList = []
            // booksList.push(books)
            // console.log
            if (err) {
                console.log("err req books");
            } else {
                if (req.body.category_id != null) {
                    books = books.filter(book => book.categoryID == req.body.category_id);

                }
                if (req.body.price1 != null && req.body.price2 != null) {
                    books = books.filter(book => (book.priceBook >= req.body.price1 && book.priceBook <= req.body.price2));
                }
                if (req.body.nameBook != null) {
                    books = books.filter(book => (book.nameBook.toLowerCase().indexOf(req.body.nameBook) != -1));
                    console.log(books)
                }
                if (req.body.sortByPrice == "sortAscending") {
                    books.sort(function(a, b) {
                        return (a.priceBook) - (b.priceBook);
                    });
                    // books = books.filter((element, index) => {
                    //     return index === 0 || element.priceBook !== books[index - 1].priceBook;
                    // });
                    // console.log(books)
                }
                if (req.body.sortByPrice == "sortDescending") {
                    books.sort(function(a, b) {
                        return (b.priceBook) - (a.priceBook);
                    });
                    // books = books.filter((element, index) => {
                    //     return index === 0 || element.priceBook !== books[index - 1].priceBook;
                    // });
                    console.log(books)
                }
                res.json(books);
            }
        });
});


// Xử lý thanh toán
//Update QuantityBoook by BookID & Quantity
async function UpdateQuantityByBookID(abook, bookQuantityUpdate, res) {

    const Updatebook = await book.findByIdAndUpdate(abook._id, {
        $set: {
            quantity: abook.quantity + bookQuantityUpdate,
        }
    }, {
        new: true
    })

    return Updatebook
}
async function getBookByID(req, res) {
    const abook = await book.findById(req)

    return abook
}

router.post('/UpdateQuantity', function(req, res) {
    async function run() {
        const abook = await getBookByID(req.body._id, res)
        const update = await UpdateQuantityByBookID(abook, req.body.quantity, res)
        console.log(update)
        res.json(update)
    }
    run()
})


//check Giỏ hàng thanh toán bất đồng bộ
router.post('/CheckBillBeforePay', function(req, res) {
    async function run() {
        let temp = -1;
        for (let index in req.body) {
            const abook = await getBookByID(req.body[index]._id, res)
                //kiểm số lượng oke thì trừ
            if (abook.quantity >= req.body[index].count) {

                const update = await UpdateQuantityByBookID(abook, -req.body[index].count, res)
            } else {
                temp = index
                break
            }
        }
        if (temp == -1) {
            res.json(true)
        } else { //roll back dữ liệu
            for (let index in req.body) {
                if (temp == index) {
                    break
                }
                const abook = await getBookByID(req.body[index]._id, res)
                const update = await UpdateQuantityByBookID(abook, req.body[index].count, res)
            }
            res.json(false)
        }
    }
    run()
})

router.get('/getBookSale/get', function(req, res) {
    console.log('get request for all books');
    book.find({})
        .exec(function(err, books) {
            if (err) {
                console.log("err req books");
            } else {
                books = books.filter(book => (book.sale > 0));
                res.json(books);
            }
        });
});
module.exports = router;