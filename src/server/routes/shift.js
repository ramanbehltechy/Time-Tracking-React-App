var express = require('express');
var router = express.Router();
var shift = require('../handlers/shiftHandler')

router.post("/GetShifts", function (req, res, next) {
    var myobj = req.body;
    shift.getShifts(myobj, (error, obj) => {
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
    shift.getMasterData(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
})

router.post("/GetShiftDetails", function (req, res, next) {
    var myobj = req.body;
    shift.getShiftDetails(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    }) 
})

router.post("/AddShift", function (req, res, next) {
    var myobj = req.body;
    shift.addShift(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
})

module.exports = router;