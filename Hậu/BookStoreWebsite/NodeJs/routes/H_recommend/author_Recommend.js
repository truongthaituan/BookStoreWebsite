const express = require('express');
const router = express.Router();
const order = require('../../models/E_payment/order');
const orderDetail = require('../../models/E_payment/orderDetail');
const book = require('../../models/A_store/book');
const acountSocial = require('../../models/C_permission/accountsocials');
const user = require('../../models/C_permission/user');
const customer = require('../../models/B_profile/customer');
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
async function getAuthorBookByBookID(req, res) {
    try {
        const aBook = await book.findById(req);
        return aBook.authorID;
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
//Đếm Tác giả trong từng OrderDetail của User
async function CreateDataAuthorCount(data, orderDetail, user, author) {
    let isExist1 = (data2, orderDetailCheck, userCheck, bookAuthor) => {
        for (var key in data2) {
            if (data2[key].userID == userCheck.userID) { //check UserID
                if (data2[key].authorID == bookAuthor) {
                    data2[key].count += orderDetailCheck.count;
                    return data2;
                }
            }
        }
        var dataReturn = {}
        dataReturn = { "userID": userCheck.userID, "authorID": bookAuthor, "count": orderDetailCheck.count }
        data2.push(dataReturn);
        return data2;
    }
    return isExist1(data, orderDetail, user, author);
}

router.get('/Data', function(req, res) {
    async function run() {
        let DataAuthor = []
        let temp = 0
        const orderArray = await getAllOrder(req, res);

        for (var index in orderArray) {
            const userInOrder = await getUserIDByCusID(orderArray[index].customerID, res);
            const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
            for (var index2 in orderDetailArray) {
                const bookAuthor = await getAuthorBookByBookID(orderDetailArray[index2].bookID, res);

                // DataAuthor.push(orderDetailArray[index2]);
                //kiểm tra xem id sách có tồn tại trong danh sách
                //nếu chưa thì thêm , có rồi thì cộng
                DataAuthor = await CreateDataAuthorCount(DataAuthor, orderDetailArray[index2], userInOrder, bookAuthor)
            }
        }
        DataAuthor.sort(function(a, b) {
            return b.count - a.count;
        });
        // id user
        var s = await recommendation_eng(DataAuthor, "5eb5804d583fc710fc965457", pearson_correlation);

        res.json(s);
    }
    run();
})




//recommend
//get all by UserID
async function getPerson(data, req) {

    const result = data.filter(word => word.userID == req);
    return result;

}
//lọc Userid trùng
async function deduplicate(arr) {
    let isExist = (arr, x) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].userID == x.userID) return true;
        }
        return false;
    }

    let ans = [];
    arr.forEach(element => {
        if (!isExist(ans, element)) ans.push(element);
    });
    return ans;
}

var len = function(obj) {
        var len = 0;
        for (var i in obj) {
            len++
        }
        return len;
    }
    //Kiểm tra tồn tại by book
async function isExist2(data, element) {
    let isExist1 = (data2, x) => {
        for (var key in data2) {
            if (data2[key].authorID == x.authorID) {

                return true;
            }
        } {

            return false;
        }
    }
    return isExist1(data, element);
}
//recommend 2 user
async function pearson_correlation(dataset, p1, p2) {

    var existp1p2 = {};
    const Person1 = await getPerson(dataset, p1);
    const Person2 = await getPerson(dataset, p2);
    for (var key1 in Person1) {
        for (var key2 in Person2) {
            if (Person1[key1].authorID == Person2[key2].authorID) {
                existp1p2[Person1[key1].authorID] = 1
                break;
            }
        }
    }

    var num_existence = len(existp1p2);
    if (num_existence == 0) return 0;
    //store the sum and the square sum of both p1 and p2
    //store the product of both
    var p1_sum = 0,
        p2_sum = 0,
        p1_sq_sum = 0,
        p2_sq_sum = 0,
        prod_p1p2 = 0,
        p1_cur = 0,
        p2_cur = 0;

    //calculate the sum and square sum of each data point
    //and also the product of both point
    for (var key in existp1p2) {
        for (var key1 in Person1) {
            if (key == Person1[key1].authorID) {
                p1_cur = Person1[key1].count;
                p1_sum += Person1[key1].count;
                p1_sq_sum += Math.pow(Person1[key1].count, 2);
                break;
            }
        }
        for (var key2 in Person2) {
            if (key == Person2[key2].authorID) {
                p2_cur = Person2[key2].count;
                p2_sum += Person2[key2].count;
                p2_sq_sum += Math.pow(Person2[key2].count, 2);
                break;
            }
        }
        prod_p1p2 += p1_cur * p2_cur;
    }
    var numerator = prod_p1p2 - (p1_sum * p2_sum / num_existence);
    var st1 = p1_sq_sum - Math.pow(p1_sum, 2) / num_existence;
    var st2 = p2_sq_sum - Math.pow(p2_sum, 2) / num_existence;
    var denominator = Math.sqrt(st1 * st2);
    if (denominator == 0) return 0;
    else {
        var val = numerator / denominator;

        return val;
    }

}
//recommend System test
async function recommendation_eng(dataset, person, pearson_correlation) {

    var totals = {
        setDefault: function(props, value) {
            if (!this[props]) {
                this[props] = 0;
            }
            this[props] += value;
        }
    };
    var simsum = {
        setDefault: function(props, value) {
            if (!this[props]) {
                this[props] = 0;
            }

            this[props] += value;
        }
    };
    var rank_lst = [];
    const dataPerson2 = await getPerson(dataset, person);
    // Lọc tên trùng
    var datafilter = await deduplicate(dataset);
    for (var other in datafilter) {

        if (datafilter[other].userID == person) continue;
        var similar = await pearson_correlation(dataset, person, datafilter[other].userID);
        if (similar <= 0) continue;
        const dataPerson1 = await getPerson(dataset, datafilter[other].userID);
        for (var data1 in dataPerson1) {
            if (!(await isExist2(dataPerson2, dataPerson1[data1]))) {
                totals.setDefault(dataPerson1[data1].authorID, dataPerson1[data1].count * similar);
                simsum.setDefault(dataPerson1[data1].authorID, similar);
            }
        }
    }

    for (var item in totals) {
        //this what the setter function does
        //so we have to find a way to avoid the function in the object     
        if (typeof totals[item] != "function") {
            var val = totals[item] / simsum[item];
            rank_lst.push({ val: val, items: item });
        }
    }
    rank_lst.sort(function(a, b) {
        return b.val < a.val ? -1 : b.val > a.val ?
            1 : b.val >= a.val ? 0 : NaN;
    });
    var recommend = [];
    for (var i in rank_lst) {
        recommend.push(rank_lst[i].items);
    }
    return recommend;
}
module.exports = router;