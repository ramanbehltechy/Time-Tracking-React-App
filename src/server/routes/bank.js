var express = require('express');
var router = express.Router();
var bank = require('../handlers/bankHandler')

router.post("/GetBanks", function (req, res, next) {
    var myobj = req.body;
    bank.getBanks(myobj, (error, obj) => {
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
    bank.getMasterData(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
})

router.post("/GetBankDetails", function (req, res, next) {
    var myobj = req.body;
    bank.getBankDetails(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
})

router.post("/AddBank", function (req, res, next) {
    var myobj = req.body;
    bank.addBank(myobj, (error, obj) => {
        if (error) {
            res.json(error);
        }
        else {
            res.json(obj)
        }
    })
})

module.exports = router;