var express = require('express');
var router = express.Router();
var reports = require('../handlers/ReportsHandler');

router.post('/GetEmployeeReport', function(req, res, next) {
  var myobj = req.body;
  reports.getEmployeeReport(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});


module.exports = router;
