var express = require('express');
var router = express.Router();
var designation = require('../handlers/designationHandler')

router.post("/GetDesignations", function (req, res, next) {
    var myobj = req.body;
    designation.getDesignations(myobj, (error, obj) => {
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
    designation.getMasterData(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
})

router.post("/GetDesignationDetails", function (req, res, next) {
    var myobj = req.body;
    designation.getDesignationDetails(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
})

router.post("/AddDesignation", function (req, res, next) {
    var myobj = req.body;
    designation.addDesignation(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
})

module.exports = router;