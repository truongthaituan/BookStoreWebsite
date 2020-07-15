const express = require('express');
const router = express.Router();
const segment = require('../../models/D_action/segment');
//wheel
//get all
router.get('/', function(req, res) {
    console.log('get request for all segmnets');
    segment.find({})
        .exec(function(err, segments) {
            if (err) {
                console.log("err req segments");
            } else {
                res.json(segments);
            }
        });
});
 function getListSegments(data2, datax) {
    var segment = {}
    for (var x of datax) {
        var temp = 0;
        for (var key in data2) {
            if (data2[key].fillStyle == x.fillStyle && data2[key].text == x.text) {
                temp = 1;
                break;
            }
        } 
        if(temp == 0){
            segment = { "fillStyle": x.fillStyle, "text": x.text }
            data2.push(segment);
        }
    }
    return data2
}

// get a wheel
router.get('/:wheelID', function(req, res) {
        let segmentsList = []
        let segmentIndex = {}
        segment.findById(req.params.wheelID)
            .exec(function(err, segment) {
                if (err) console.log("Error retrieving rating");
                else 
                {
                    segmentsList = getListSegments(segmentsList, segment.segments)
                    segmentIndex = {"_id": segment._id, "nameWheel": segment.nameWheel, "segments": segmentsList, "isActive": segment.isActive }  
                }
                res.json(segmentIndex)
            });
})
// get a wheel
router.get('/getSegment/:wheelID', function(req, res) {
    segment.findById(req.params.wheelID)
        .exec(function(err, segment) {
            if (err) console.log("Error retrieving rating");
            else res.json(segment)
        });
})

//post
router.post('/', function(req, res) {
    async function run() {
        const add = await addSegment(req)
        res.json(add);
    }
    run()
});
async function addSegment(req) {
    var newSegment = new segment();
    newSegment.nameWheel = req.body.nameWheel
    newSegment.segments = [
        {
            "fillStyle": "#99ddff",
            "text": req.body.option3
        },
        {
            "fillStyle": "#eae56f",
            "text": req.body.option0
        },
        {
            "fillStyle": "#4dff4d",
            "text": req.body.option2
        },
        {
            "fillStyle": "#ff80ff",
            "text": req.body.option4
        },
        {
            "fillStyle": "#eae56f",
            "text": req.body.option0
        },
        {
            "fillStyle": "#99ddff",
            "text": req.body.option3
        },
        {
            "fillStyle": "#809fff",
            "text": req.body.option1
        },
        {
            "fillStyle": "#eae56f",
            "text": req.body.option0
        },
        {
            "fillStyle": "#99ddff",
            "text": req.body.option3
        },
        {
            "fillStyle": "#4dff4d",
            "text": req.body.option2
        },
        {
            "fillStyle": "#eae56f",
            "text": req.body.option0
        },
        {
            "fillStyle": "#ffc299",
            "text": req.body.option5
        },
    ]
    newSegment.isActive = req.body.isActive
    newSegment.save()
    return newSegment;
}

 //delete
 router.delete('/:wheelID', function(req, res) {
    segment.findByIdAndRemove(req.params.wheelID, function(err, deleterating) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json('Successfully deleted');
        }
    });
});
// //update
router.put('/:id', function(req, res) {
        async function run() {
            const update = await UpdateByID(req.params.id)

            res.json(update);
        }
        run();
    })
    async function UpdateByID(id){
        const seg = await segment.findByIdAndUpdate(id, {
            $set: {
                segments:  [
                    {
                        "fillStyle": "#99ddff",
                        "text": req.body.option3
                    },
                    {
                        "fillStyle": "#eae56f",
                        "text": req.body.option0
                    },
                    {
                        "fillStyle": "#4dff4d",
                        "text": req.body.option2
                    },
                    {
                        "fillStyle": "#ff80ff",
                        "text": req.body.option4
                    },
                    {
                        "fillStyle": "#eae56f",
                        "text": req.body.option0
                    },
                    {
                        "fillStyle": "#99ddff",
                        "text": req.body.option3
                    },
                    {
                        "fillStyle": "#809fff",
                        "text": req.body.option1
                    },
                    {
                        "fillStyle": "#eae56f",
                        "text": req.body.option0
                    },
                    {
                        "fillStyle": "#99ddff",
                        "text": req.body.option3
                    },
                    {
                        "fillStyle": "#4dff4d",
                        "text": req.body.option2
                    },
                    {
                        "fillStyle": "#eae56f",
                        "text": req.body.option0
                    },
                    {
                        "fillStyle": "#ffc299",
                        "text": req.body.option5
                    },
                ]
            }
        }, {
            new: true
        })
        
        return seg
    }
    //delete
// router.delete('/:id', function(req, res) {
//     rating.findByIdAndRemove(req.params.id, function(err, deleterating) {
//         if (err) {
//             res.send('err Delete');
//         } else {
//             res.json({ message: 'Successfully deleted' });
//         }
//     });
// });
module.exports = router