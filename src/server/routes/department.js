var express = require('express');
var router = express.Router();
var department = require('../handlers/departmentHandler')

router.post("/GetDepartments", function (req, res, next) {
    var myobj = req.body;
    department.getDepartments(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
});


router.post("/GetMasterData", function (req, res, next) {
    var myobj = req.body;
    department.getMasterData(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
})

router.post("/GetDepartmentDetails", function (req, res, next) {
    var myobj = req.body;
    department.getDepartmentDetails(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
})

router.post("/AddDepartment", function (req, res, next) {
    var myobj = req.body;
    department.addDepartment(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
})


module.exports = router;