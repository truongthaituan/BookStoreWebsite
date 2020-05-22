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
// //Kiểm tra ngày tháng năm (check theo tuần (2 tuần so với now cho luôn có dữ liệu))
// async function CheckDateByWeek(dateNow, dateCheck) {
//     let run = (now, check) => {
//         date = { "Mon": 2, "Tue": 3, "Wes": 4, "Thu": 5, "Fri": 6, "Sat": 7, "Sun": 8 }
//         month = { "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "June": 6, "July": 7, "Aug": 8, "Sept": 9, "Oct": 10, "Nov": 11, "Dec": 12 }
//         var nowSplit = now.split(" ");
//         var checkSplit = check.split(" ");

//         if (nowSplit[3] == checkSplit[3]) { //năm =
//             if (month[nowSplit[1]] == month[checkSplit[1]]) { //tháng
//                 if (nowSplit[2] - 14 <= checkSplit[2] && nowSplit[2] >= checkSplit[2]) { //cách now 14 ngày
//                     console.log(dateCheck)
//                     return true;
//                 }
//             } else { //tháng nhỏ hơn hiện tại
//                 if (month[nowSplit[1]] - 1 == month[checkSplit[1]]) { //tháng now -1 = tháng
//                     if (nowSplit[2] - 14 + 30 <= checkSplit[2]) { //nếu số ngày -14+30  so sánh với ngày check hiện tại (tháng trước)
//                         console.log(dateCheck)
//                         return true;
//                     }
//                 }
//             }
//         } else { //năm nhỏ hơn năm hiện tại
//             if (nowSplit[3] - 1 == checkSplit[3]) { //năm -1 = năm
//                 if (month[nowSplit[1]] == 1 && month[checkSplit[1]] == 12) { //now là đầu nằm (check là cuối năm)
//                     if (nowSplit[2] - 14 + 30 <= checkSplit[2]) { //nếu số ngày -14+30  so sánh với ngày check hiện tại (tháng trước)
//                         console.log(dateCheck)
//                         return true;
//                     }
//                 }
//             }
//         }
//         return false;
//     }
//     return run(dateNow, dateCheck);
// }
//check theo week
async function checkWeek(dateNow, dateCheck) { //theo tuần
    let run = (now, check) => {
        date = { "Mon": 2, "Tue": 3, "Wes": 4, "Thu": 5, "Fri": 6, "Sat": 7, "Sun": 8 } //thứ 2 là đầu tuần
        month = { "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "June": 6, "July": 7, "Aug": 8, "Sept": 9, "Oct": 10, "Nov": 11, "Dec": 12 }
        var nowSplit = now.split(" ");
        var checkSplit = check.split(" ");
        if (nowSplit[3] == checkSplit[3]) { //năm =
            if (month[nowSplit[1]] == month[checkSplit[1]]) { //tháng =
                if (nowSplit[2] - 7 <= checkSplit[2] && nowSplit[2] >= checkSplit[2]) { //không cách quá 7 ngày
                    if (date[nowSplit[0]] >= date[checkSplit[0]]) //set ngày trong tuần không được lớn hơn now
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    return run(dateNow, dateCheck);
}
//check theo month
async function checkMonth(dateNow, dateCheck) { //theo tuần
    let run = (now, check) => {
        month = { "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "June": 6, "July": 7, "Aug": 8, "Sept": 9, "Oct": 10, "Nov": 11, "Dec": 12 }
        var nowSplit = now.split(" ");
        var checkSplit = check.split(" ");
        if (nowSplit[3] == checkSplit[3]) { //năm =
            if (month[nowSplit[1]] == month[checkSplit[1]]) { //tháng =
                return true;
            }
        }
        return false;
    }
    return run(dateNow, dateCheck);
}
//check theo year
async function checkYear(dateNow, dateCheck) { //theo tuần
    let run = (now, check) => {
        var nowSplit = now.split(" ");
        var checkSplit = check.split(" ");
        if (nowSplit[3] == checkSplit[3]) { //năm =
            return true;
        }
        return false;
    }
    return run(dateNow, dateCheck);
}
//Đếm sách trong từng OrderDetail
async function CreateListBookBuyMost(data, element) {
    let isExist1 = (data2, x) => {

        for (var key in data2) {
            if (data2[key].bookID == x.bookID) {
                data2[key].count += x.count;
                return data2;
            }
        } {
            var book = {}
            book = { "bookID": x.bookID, "count": x.count }
            data2.push(book);
            return data2;
        }
    }
    return isExist1(data, element);
}
router.get('/BuyTheMost', function(req, res) {
    async function run() {
        let arrayBookBuyTheMost = []
        let temp = 0
        const orderArray = await getAllOrder(req, res);
        for (var index in orderArray) {
            const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
            for (var index2 in orderDetailArray) {
                // arrayBookBuyTheMost.push(orderDetailArray[index2]);
                //kiểm tra xem id sách có tồn tại trong danh sách
                //nếu chưa thì thêm , có rồi thì cộng
                arrayBookBuyTheMost = await CreateListBookBuyMost(arrayBookBuyTheMost, orderDetailArray[index2])
            }
        }
        arrayBookBuyTheMost.sort(function(a, b) {
            return b.count - a.count;
        });
        //show 10 book most 
        let arrayBookMost = []

        for (var index in arrayBookBuyTheMost) {
            let aBook = await getBookByID(arrayBookBuyTheMost[index].bookID, res)
            arrayBookMost.push(aBook);
            if (index >= 10) break;
        }
        res.json(arrayBookMost);
    }
    run();
})

//Buy the most By week
router.get('/BookBuyTheMostOnWeek', function(req, res) {
        async function run() {
            let arrayBookBuyTheMost = []
            let temp = 0
            var today = new Date();
            today = today.toString().substring(0, 24);
            const orderArray = await getAllOrder(req, res);
            for (var index in orderArray) {
                if (await checkWeek(today, orderArray[index].orderDate) == true) {
                    const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
                    for (var index2 in orderDetailArray) {
                        // arrayBookBuyTheMost.push(orderDetailArray[index2]);
                        //kiểm tra xem id sách có tồn tại trong danh sách
                        //nếu chưa thì thêm , có rồi thì cộng
                        arrayBookBuyTheMost = await CreateListBookBuyMost(arrayBookBuyTheMost, orderDetailArray[index2])
                    }
                }
            }
            arrayBookBuyTheMost.sort(function(a, b) {
                return b.count - a.count;
            });
            //show 10 book most 
            let arrayBookMost = []

            for (var index in arrayBookBuyTheMost) {
                let aBook = await getBookByID(arrayBookBuyTheMost[index].bookID, res)
                arrayBookMost.push(aBook);
                if (index >= 10) break;
            }
            res.json(arrayBookMost);
        }
        run();
    })
    //Buy the most By month
router.get('/BookBuyTheMostOnMonth', function(req, res) {
        async function run() {
            let arrayBookBuyTheMost = []
            let temp = 0
            var today = new Date();
            today = today.toString().substring(0, 24);
            const orderArray = await getAllOrder(req, res);
            for (var index in orderArray) {
                if (await checkMonth(today, orderArray[index].orderDate) == true) {
                    const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
                    for (var index2 in orderDetailArray) {
                        // arrayBookBuyTheMost.push(orderDetailArray[index2]);
                        //kiểm tra xem id sách có tồn tại trong danh sách
                        //nếu chưa thì thêm , có rồi thì cộng
                        arrayBookBuyTheMost = await CreateListBookBuyMost(arrayBookBuyTheMost, orderDetailArray[index2])
                    }
                }
            }
            arrayBookBuyTheMost.sort(function(a, b) {
                return b.count - a.count;
            });
            //show 10 book most 
            let arrayBookMost = []

            for (var index in arrayBookBuyTheMost) {
                let aBook = await getBookByID(arrayBookBuyTheMost[index].bookID, res)
                arrayBookMost.push(aBook);
                if (index >= 10) break;
            }
            res.json(arrayBookMost);
        }
        run();
    })
    //Buy the most By Year
router.get('/BookBuyTheMostOnYear', function(req, res) {
    async function run() {
        let arrayBookBuyTheMost = []
        let temp = 0
        var today = new Date();
        today = today.toString().substring(0, 24);
        const orderArray = await getAllOrder(req, res);
        for (var index in orderArray) {
            if (await checkYear(today, orderArray[index].orderDate) == true) {
                const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
                for (var index2 in orderDetailArray) {
                    // arrayBookBuyTheMost.push(orderDetailArray[index2]);
                    //kiểm tra xem id sách có tồn tại trong danh sách
                    //nếu chưa thì thêm , có rồi thì cộng
                    arrayBookBuyTheMost = await CreateListBookBuyMost(arrayBookBuyTheMost, orderDetailArray[index2])
                }
            }
        }
        arrayBookBuyTheMost.sort(function(a, b) {
            return b.count - a.count;
        });
        //show 10 book most 
        let arrayBookMost = []

        for (var index in arrayBookBuyTheMost) {
            let aBook = await getBookByID(arrayBookBuyTheMost[index].bookID, res)
            arrayBookMost.push(aBook);
            if (index >= 10) break;
        }
        res.json(arrayBookMost);
    }
    run();
})
module.exports = router;