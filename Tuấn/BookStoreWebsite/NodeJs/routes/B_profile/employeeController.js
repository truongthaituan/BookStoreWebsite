const express = require('express');
const router = express.Router();
const employee = require('../../models/B_profile/employee');
//employee
//get all
router.get('/', function(req, res) {
    console.log('get request for all employees');
    employee.find({})
        .exec(function(err, employees) {
            if (err) {
                console.log("err req employees");
            } else {
                res.json(employees);
            }
        });
});

// get a person
router.get('/:employeeID', function(req, res) {
    employee.findById(req.params.employeeID)
        .exec(function(err, employees) {
            if (err) console.log("Error retrieving employee");
            else res.json(employees);
        });
})

//post
router.post('/', function(req, res) {
    var newemployee = new employee();
    newemployee.userID = req.body.userID;
    newemployee.nameEmp = req.body.nameEmp;
    newemployee.phone = req.body.phone;
    newemployee.address = req.body.address;
    newemployee.nickName = req.body.nickName;
    newemployee.email = req.body.email;
    newemployee.male = req.body.male;
    newemployee.dateOfBirth = req.body.dateOfBirth;
    newemployee.save(function(err, insertedemployee) {
        if (err) {
            console.log('Err Saving employee');
        } else {
            res.json(insertedemployee);
        }
    });
});


//update
router.put('/:id', function(req, res) {
        employee.findByIdAndUpdate(req.params.id, {
                $set: {
                    userID: req.body.userID,
                    nameEmp: req.body.nameEmp,
                    phone: req.body.phone,
                    address: req.body.address,
                    nickName: req.body.nickName,
                    email: req.body.email,
                    male: req.body.male,
                    dateOfBirth: req.body.dateOfBirth,
                }
            }, {
                new: true
            },
            function(err, updatedemployee) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedemployee);
                }
            })
    })
    //delete
router.delete('/:id', function(req, res) {
    employee.findByIdAndRemove(req.params.id, function(err, deleteemployee) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
});
module.exports = router;