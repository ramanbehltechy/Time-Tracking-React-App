const sql = require('mssql');
var soap = require('soap');
const utils = require('../utils/config');
const config = utils.config;
const serviceUrl = utils.url;

exports.getBanks = function getBanks(myobj, callback) {
    sql.connect(config).then(() => {
        return sql.query`select * from bank`;
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
        return sql.query`select Max(bankid) AS BankID from bank;`
    }).then(result => {
        sql.close()
        key = 'LastBankId'
        obj[key] = result.recordset
        return callback(null, obj);
    }).catch(err => {
        sql.close()
        return callback(null, obj);
    })

}

exports.getBankDetails = function getBankDetails(myobj, callback) {
    sql.connect(config).then(() => {
        return sql.query`select * from bank where bankid = ${myobj.BankID}`;
    }).then(result => {
        sql.close();
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close();
        return callback(null, err);
    })

}

exports.addBank = function addBank(myobj, callback) {
    if (myobj.action == "add") {
        sql.connect(config).then(() => {
            return sql.query`INSERT INTO [bank] ([bankid]
                ,[name]
                ,[branch]
                ,[ifsc]
                ,[OrganizationID])  
            VALUES (${myobj.BankID},
                ${myobj.Name},
                ${myobj.Branch},
                ${myobj.IFSC},
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
            return sql.query`UPDATE [bank] SET
                [Name] =  ${myobj.Name}
                ,[branch] =  ${myobj.Branch}
                ,[ifsc] =  ${myobj.IFSC}
            WHERE bankid = ${myobj.BankID}`
        }).then(result => {
            sql.close()
            return callback(null, result);
        }).catch(err => {
            sql.close()
            return callback(null, err);
        })

    }
}