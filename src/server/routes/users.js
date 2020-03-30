var express = require('express');
var router = express.Router();
var user = require('../handlers/userHandler');
/* GET users listing. */
router.post('/ValidateUser', function(req, res, next) {
  var myobj = req.body;
  user.validateUser(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});
router.post('/GetEmployeesStatus', function(req, res, next) {
  var myobj = req.body;
  user.getEmployeesStatus(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});
router.post('/GetEmployees', function(req, res, next) {
  var myobj = req.body;
  user.getEmployees(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});
router.post('/GetEmployeeDetails', function(req, res, next) {
  var myobj = req.body;
  user.getEmployeeDetails(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});
router.post('/GetTimingData', function(req, res, next) {
  var myobj = req.body;
  user.getTimingData(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});
router.post('/GetAllListData', function(req, res, next) {
  var myobj = req.body;
  user.getAllListData(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});
router.post('/AddEmployee', function(req, res, next) {
  var myobj = req.body;
  user.addEmployee(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});
router.post('/DeleteEmployee', function(req, res, next) {
  var myobj = req.body;
  user.deleteEmployee(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});
router.post('/GetEmployeeScreens', function(req, res, next) {
  var myobj = req.body;
  user.getEmployeeScreens(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});
router.post('/GetEmployeeImageBase64', function(req, res, next) {
  var myobj = req.body;
  user.getEmployeeImageBase64(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});
router.post('/CheckEmailExist', function(req, res, next) {
  var myobj = req.body;
  user.checkEmailExist(myobj,(error,obj) =>{
    if(error){
      res.json(error)
    }
    else{
      res.json(obj);
    }
  })
});

module.exports = router;
