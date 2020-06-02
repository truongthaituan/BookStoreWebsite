const express = require('express');
const router = express.Router();
// const dataset = require('../../models/dataset');
const rating = require("../../models/D_action/rating")
const book = require('../../models/A_store/book')
    //dataset
    //get all
router.get('/Data/:userID', function(req, res) {
    async function run() {
        console.log('get request for all datasets');
        var datasets = await getALl(req, res);

        // var s = await pearson_correlation(datasets, "Lisa Rose", "Jack Matthews");
        // var s = await similar_user(datasets, 'Jack Matthews', 3, pearson_correlation);
        // console.log(s);
        var s = await recommendation_eng(datasets, req.params.userID, pearson_correlation);

        res.json((s));
    }
    run();
});
//get book by bookID
async function getBookByID(req) {

    const data = await book.findById(req);
    return data;

}
//get all data
async function getALl(req, res) {
    try {
        const data = await rating.find({

        });

        return data;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//get persion by name
async function getPerson(req) {
    try {
        const P1 = await rating.find({
            userID: req
        });

        return P1;
    } catch (err) {
        return res.status(501).json(err);
    }
}
var len = function(obj) {
    var len = 0;
    for (var i in obj) {
        len++
    }
    return len;
}

// var pearson_correlation = async function(dataset, p1, p2) {
async function pearson_correlation(dataset, p1, p2) {
    try {
        var existp1p2 = {};
        const Person1 = await getPerson(p1);
        const Person2 = await getPerson(p2);
        for (var key1 in Person1) {
            for (var key2 in Person2) {
                if (Person1[key1].bookID == Person2[key2].bookID) {
                    existp1p2[Person1[key1].bookID] = 1
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
                if (key == Person1[key1].bookID) {
                    p1_cur = parseFloat(Person1[key1].star);
                    p1_sum += parseFloat(Person1[key1].star);
                    p1_sq_sum += parseFloat(Math.pow(parseFloat(Person1[key1].star), 2));
                    break;
                }
            }
            for (var key2 in Person2) {
                if (key == Person2[key2].bookID) {
                    p2_cur = parseFloat(Person2[key2].star);
                    p2_sum += parseFloat(Person2[key2].star);
                    p2_sq_sum += parseFloat(Math.pow(parseFloat(Person2[key2].star), 2));

                    break;
                }
            }
            prod_p1p2 += p1_cur * p2_cur;


        }


        var numerator = parseFloat(prod_p1p2 - (p1_sum * p2_sum / num_existence));

        var st1 = p1_sq_sum - Math.pow(p1_sum, 2) / num_existence;
        var st2 = p2_sq_sum - Math.pow(p2_sum, 2) / num_existence;

        var denominator = Math.sqrt(st1 * st2);

        if (denominator == 0) return 0;
        else {
            var val = parseFloat(numerator / denominator);
            console.log(val + "  ------------val" + numerator + "/" + denominator)
            return val;
        }
    } catch (err) {
        return res.status(501).json(err);
    }
}

async function similar_user(dataset, person, num_user, pearson_correlation) {
    try {
        var scores = [];
        //locj tene trung
        var datafilter = await deduplicate(dataset);

        for (var others in datafilter) {
            if (datafilter[others].userID != person) {
                var val = await pearson_correlation(datafilter, person, datafilter[others].userID)
                var p = datafilter[others].userID
                scores.push({ val: val, p: p });
            }
        }
        scores.sort(function(a, b) {
            return b.val < a.val ? -1 : b.val > a.val ? 1 : b.val >= a.val ? 0 : NaN;
        });

        var score = [];
        for (var i = 0; i < num_user; i++) {
            score.push(scores[i]);
        }

        return score;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//lọc trùng nhau
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
//Kiểm tra tồn tại by book
async function isExist2(data, element) {
    let isExist1 = (data2, x) => {
        for (var key in data2) {
            if (data2[key].bookID == x.bookID) {
                console.log("dung roi day");
                return true;
            }
        } {
            console.log("day la sai");
            return false;
        }
    }
    return isExist1(data, element);
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
    const dataPerson2 = await getPerson(person);
    // Lọc tên trùng
    var datafilter = await deduplicate(dataset);
    for (var other in datafilter) {

        if (datafilter[other].userID == person) continue;
        var similar = await pearson_correlation(dataset, person, datafilter[other].userID);
        if (similar <= 0) continue;
        const dataPerson1 = await getPerson(datafilter[other].userID);
        console.log(other);
        for (var data1 in dataPerson1) {
            if (!(await isExist2(dataPerson2, dataPerson1[data1]))) {
                totals.setDefault(dataPerson1[data1].bookID, parseFloat(dataPerson1[data1].star) * similar);
                simsum.setDefault(dataPerson1[data1].bookID, similar);
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
    console.log([rank_lst, recommend]);

    //lấy list book
    const ListBookRecommend = []
    for (let index in recommend) {
        const abook = await getBookByID(recommend[index])
        console.log(recommend[index])
        console.log(abook)
        ListBookRecommend.push(abook)
    }

    return ListBookRecommend;
}

module.exports = router;