const express = require('express');
const router = express.Router();
const order = require('../../models/E_payment/order');
const orderDetail = require('../../models/E_payment/orderDetail');
const book = require('../../models/A_store/book');
const acountSocial = require('../../models/C_permission/accountsocials');
const user = require('../../models/C_permission/user');
const customer = require('../../models/B_profile/customer');
const categoryModel = require('../../models/A_store/category')
    //thống kê Danh sách sách mua nhiều
async function getAllOrder(req, res) {
    try {
        const orderArray = await order.find({});
        return orderArray;
    } catch (err) {
        return res.status(501).json(err);
    }
}
async function getOrderDetailByOrderID(req, res) {
    try {
        const orderDetailArray = await orderDetail.find({
            orderID: req
        });
        return orderDetailArray;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//get book by ID
async function getBookByBookID(req, res) {
    try {
        const aBook = await book.findById(req);
        return aBook;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//get book by CategoryID
async function getBookByCategoryID(req, res) {
    try {
        const aBook = await book.find({ categoryID: req });
        return aBook;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//get userID by Customer ID
async function getUserIDByCusID(req, res) {
    try {
        const aUser = await customer.findById(req);
        return aUser;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//Đếm sách trong từng OrderDetail của User
async function CreateDataBookCount(data, orderDetail, user, book) {
    let isExist1 = (data2, orderDetailCheck, userCheck, bookBook) => {
        for (var key in data2) {
            if (data2[key].userID == userCheck.userID) { //check UserID
                if (data2[key].bookID == bookBook) {
                    data2[key].count += orderDetailCheck.count;
                    return data2;
                }
            }
        }
        var dataReturn = {}
        dataReturn = { "userID": userCheck.userID, "bookID": bookBook, "count": orderDetailCheck.count }
        data2.push(dataReturn);
        return data2;
    }
    return isExist1(data, orderDetail, user, book);
}
async function CreateDataCategoryCount(data, orderDetail, user, category) {
    let isExist1 = (data2, orderDetailCheck, userCheck, bookCategory) => {
        for (var key in data2) {
            if (data2[key].userID == userCheck.userID) { //check UserID
                // console.log(data2[key].categoryID + "-------------" + bookCategory._id)
                if (data2[key].categoryID.equals(bookCategory._id)) {
                    // console.log("oke")
                    data2[key].count += orderDetailCheck.count;
                    return data2;
                }
            }
        }
        var dataReturn = {}
        dataReturn = { "userID": userCheck.userID, "categoryID": bookCategory._id, "categoryName": bookCategory.nameCategory, "count": orderDetailCheck.count }

        data2.push(dataReturn);
        return data2;
    }
    return isExist1(data, orderDetail, user, category);
}

async function getCategoryBookByBookID(req, res) {
    try {
        const aBook = await book.findById(req);
        const category = await categoryModel.findById(aBook.categoryID);
        return category;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//Show sách bán chạy nhất
router.get('/Book', function(req, res) {
        async function run() {
            let BookList = []
            let DataBook = []
            const orderArray = await getAllOrder(req, res);
            // console.log("DataBook")
            for (var index in orderArray) {
                const userInOrder = await getUserIDByCusID(orderArray[index].customerID, res);
                const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
                for (var index2 in orderDetailArray) {
                    // DataBook.push(orderDetailArray[index2]);
                    //kiểm tra xem id sách có tồn tại trong danh sách
                    //nếu chưa thì thêm , có rồi thì cộng
                    DataBook = await CreateDataBookCount(DataBook, orderDetailArray[index2], userInOrder, orderDetailArray[index2].bookID)

                }
            }
            DataBook.sort(function(a, b) {
                return b.count - a.count;
            });
            //get book by Databook
            for (var index in DataBook) {
                if (index > 10) {
                    break;
                }
                // console.log(DataBook[index].bookID)
                const abook = await getBookByBookID(DataBook[index].bookID, res);
                // console.log(abook)
                BookList.push(abook);

            }
            // id user
            res.json(BookList);
        }
        run();
    })
    //show những sách người dùng mua nhiều nhất trong thể loại 
router.get('/BookByCategory/:UserID', function(req, res) {
    async function run() {
        let BookList = []
        let DataBook = []
        const orderArray = await getAllOrder(req, res);
        for (var index in orderArray) {
            const userInOrder = await getUserIDByCusID(orderArray[index].customerID, res);
            if (userInOrder.userID != req.params.UserID) continue

            const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);

            for (var index2 in orderDetailArray) {
                const bookCategory = await getCategoryBookByBookID(orderDetailArray[index2].bookID, res);

                //kiểm tra xem id sách có tồn tại trong danh sách
                //nếu chưa thì thêm , có rồi thì cộng
                DataBook = await CreateDataCategoryCount(DataBook, orderDetailArray[index2], userInOrder, bookCategory)

            }
        }
        // console.log(DataBook)
        DataBook.sort(function(a, b) {
            return b.count - a.count;
        });

        //get book by Databook
        for (var index in DataBook) {
            if (index > 1) {
                break;
            }
            const abook = await getBookByCategoryID(DataBook[index].categoryID, res);
            //set key Object
            const categoryName = DataBook[index].categoryName;
            var obj = {};
            obj[categoryName] = abook;

            BookList.push(obj);
            // số lượng category muon

        }
        // id user
        res.json(BookList);
    }
    run();
})

module.exports = router;