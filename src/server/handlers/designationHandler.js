const sql = require('mssql');
var soap = require('soap');
const utils = require('../utils/config');
const config = utils.config;
const serviceUrl = utils.url;

exports.getDesignations = function getDesignations(myobj, callback) {
    sql.connect(config).then(() => {
        return sql.query`select * from Designation where OrganizationID = ${myobj.OrganizationID}`;
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
        return sql.query`select Max(DesignationId) AS DesignationId from Designation;`
    }).then(result => {
        sql.close()
        key = 'LastDesignationId'
        obj[key] = result.recordset
        return callback(null, obj);
    }).catch(err => {
        sql.close()
        return callback(null, obj);
    })

}

exports.getDesignationDetails = function getDesignationDetails(myobj, callback) {
    sql.connect(config).then(() => {
        return sql.query`select * from Designation where DesignationId = ${myobj.DesignationId}`;
    }).then(result => {
        sql.close();
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    })

}

exports.addDesignation = function addDesignation(myobj, callback) {
    if (myobj.action == "add") {
        sql.connect(config).then(() => {
            return sql.query`INSERT INTO [Designation] ([Designationid]
                ,[name]
                ,[OrganizationID])  
            VALUES (${myobj.DesignationId},
                ${myobj.Name},
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
            return sql.query`UPDATE [Designation] SET
                [Name] =  ${myobj.Name}
            WHERE Designationid = ${myobj.DesignationId}`
        }).then(result => {
            sql.close()
            return callback(null, result);
        }).catch(err => {
            sql.close()
            return callback(null, err);
        })

    }
}