const express = require('express');
const router = express.Router();
const order = require('../../models/E_payment/order');
const orderDetail = require('../../models/E_payment/orderDetail');
const book = require('../../models/A_store/book');
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
async function getBookByID(req, res) {
    try {
        const aBook = await book.findById(req);
        return aBook;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//Đếm Tác giả trong từng OrderDetail của User
async function CreateDataAuthorCount(data, orderDetail, order) {

    let isExist1 = (data2, orderDetailCheck, orderCheck) => {

        for (var key in data2) {
            if (data2[key].userID == orderCheck.customerID) { //check UserID
                if (data2[key].bookID == orderDetailCheck.bookID) { //check BookID
                    data2[key].count += orderDetailCheck.count;
                    return data2;
                }
            }
        }
        var dataReturn = {}
        dataReturn = { "userID": orderCheck.customerID, "bookID": orderDetailCheck.bookID, "count": orderDetailCheck.count }
        data2.push(dataReturn);
        return data2;
    }
    return isExist1(data, orderDetail, order);
}

router.get('/Data', function(req, res) {
    async function run() {
        let DataAuthor = []
        let temp = 0
        const orderArray = await getAllOrder(req, res);
        for (var index in orderArray) {
            const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
            for (var index2 in orderDetailArray) {
                // DataAuthor.push(orderDetailArray[index2]);
                //kiểm tra xem id sách có tồn tại trong danh sách
                //nếu chưa thì thêm , có rồi thì cộng

                DataAuthor = await CreateDataAuthorCount(DataAuthor, orderDetailArray[index2], orderArray[index])
            }
        }
        DataAuthor.sort(function(a, b) {
            return b.count - a.count;
        });

        res.json(DataAuthor);
    }
    run();
})
module.exports = router;