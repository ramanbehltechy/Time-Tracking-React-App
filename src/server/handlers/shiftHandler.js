const sql = require('mssql');
var soap = require('soap');
const utils = require('../utils/config');
const config = utils.config;
const serviceUrl = utils.url;

exports.getShifts = function getShifts(myobj, callback) {
    sql.connect(config).then(() => {
        return sql.query`select * from Shift where OrganizationID = ${myobj.OrganizationID}`;
    }).then(result => {
        sql.close();
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    })

}

exports.getMasterData = function getMasterData(myobj, callback) {
    var obj = {}
    var key = '';
    sql.connect(config).then(() => {
        return sql.query`select Max(ShiftId) AS ShiftId from Shift;`
    }).then(result => {
        sql.close()
        key = 'LastShiftId'
        obj[key] = result.recordset
        return callback(null, obj);
    }).catch(err => {
        sql.close()
        return callback(null, obj);
    })

}

exports.getShiftDetails = function getShiftDetails(myobj, callback) {
    sql.connect(config).then(() => {
        return sql.query`select * from Shift where ShiftId = ${myobj.ShiftId}`;
    }).then(result => {
        sql.close();
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    })

}
 
exports.addShift = function addShift(myobj, callback) {
    if (myobj.action == "add") {
        sql.connect(config).then(() => {
            return sql.query`INSERT INTO [Shift] ([Shiftid]
                ,[name]
                ,[StartTime]
                ,[EndTime]
                ,[OrganizationID])  
            VALUES (${myobj.ShiftId},
                ${myobj.Name},
                ${myobj.StartTime},
                ${myobj.EndTime},
                ${myobj.OrganizationID});`
        }).then(result => {
            sql.close()
            return callback(null, result);
        }).catch(err => {
            sql.close()
            return callback(null, err);
        })
    } else {
        sql.connect(config).then(() => {
            return sql.query`UPDATE [Shift] SET
                [Name] =  ${myobj.Name},
                [StartTime] =  ${myobj.StartTime},
                [EndTime] =  ${myobj.EndTime}
            WHERE Shiftid = ${myobj.ShiftId}`
        }).then(result => {
            sql.close()
            return callback(null, result);
        }).catch(err => {
            sql.close()
            return callback(null, err);
        })

    }
}