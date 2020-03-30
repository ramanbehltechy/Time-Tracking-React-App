var express = require('express');
var router = express.Router();
var defaultColumn = require('../handlers/defaultColumnHandler')

router.post("/GetMasterData", function (req, res, next) {
    var myobj = req.body;
    defaultColumn.getMasterData(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
});


router.post("/SaveDefaultColumn", function (req, res, next) {
    var myobj = req.body;
    defaultColumn.saveDefaultColumn(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        } 
        else {
            res.json(obj)
        }
    })
});


module.exports = router;