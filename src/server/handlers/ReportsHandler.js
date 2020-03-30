const sql = require('mssql')
const utils = require('../utils/config')
const config = utils.config;

exports.getEmployeeReport = function getEmployeeReport(myobj, callback) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and execute procedure 
        let query = "exec spGetReportData  @EmpCode= '"+myobj.EmployeeId+"', @OrganizationID= '"+myobj.OrganizationID+"', @StartDate= '"+myobj.StartDate+"', @EndDate= '"+myobj.EndDate+"';";
        request.query(query, function (err, result) {
            if (err) {
                console.log(err);
                sql.close();
            }
            sql.close();
            return callback(null, result.recordsets);
        });
      });
    
  }