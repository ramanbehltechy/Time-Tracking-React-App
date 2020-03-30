const sql = require('mssql');
var soap = require('soap');
const utils = require('../utils/config');
const config = utils.config;
const serviceUrl = utils.url;
const masterData = require('../utils/masterData');

exports.getMasterData = function getMasterData(myobj, callback) {
    var employeeDisplayColumnsDefault = masterData.employeeDisplayColumnsDefault;
    var obj = {}
    var key = '';
    sql.connect(config).then(() => {
        return sql.query`select * from DefaultColumns where orgId = ${myobj.OrganizationID}`;
    }).then(result => {
        sql.close();
        key = 'DefaultColumns'
        var columns = employeeDisplayColumnsDefault.filter((col) => col.IsEditable == false);
        var skipColumns = ``;
        for (var i = 0, l = columns.length; i < l; i++) {
            skipColumns += `'${columns[i].ColumnName}'`;
            if (i != columns.length - 1) {
                skipColumns += ', ';
            }
        }
        if (result.recordset.length > 0) {
            for (var i = 0, l = result.recordset.length; i < l; i++) {
                columns.push(result.recordset[i]);
            }
            obj[key] = columns
        }
        else {
            obj[key] = employeeDisplayColumnsDefault
        }
        sql.connect(config).then(() => {
            return sql.query`select COLUMN_NAME as columnName
            from INFORMATION_SCHEMA.COLUMNS
            where TABLE_NAME='employee' and COLUMN_NAME not in (${skipColumns}) order by 1 `;
        }).then(result => {
            sql.close();
            key = 'EmployeeEditableColumns'
            // result.recordset = 
            var records = result.recordset.filter(function (col) {
                if (col.columnName != "DepartmentId" && col.columnName != "DesignationId")
                    return col
            })
            records.push({ columnName: "Department" });
            records.push({ columnName: "Designation" });
            records.sort(function (a, b) {
                var x = a.columnName.toLowerCase();
                var y = b.columnName.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });
            obj[key] = records;

            return callback(null, obj);
        }).catch(err => {
            sql.close(); 
            return callback(null, err);
        })
    }).catch(err => {
        sql.close();
        return callback(null, err);
    })

}

exports.saveDefaultColumn = function saveDefaultColumn(myobj, callback) {
    var col = myobj.employees.filter((emp) =>
        emp.IsEditable == true);
    sql.connect(config).then(() => {
        return sql.query`select max(Id) as Id from DefaultColumns`;
    }).then(result => {
        sql.close();
        var maxId = result.recordset[0].Id ? result.recordset[0].Id : 0;
        var query = ``;
        for (var i = 0, l = col.length; i < l; i++) {
            var element = col[i];
            if (element.Id == 0) {
                maxId += 1;
                query += `insert into DefaultColumns (Id,ColumnName,Entity,OrgId,IsEditable) values 
                         (${maxId}, '${element.ColumnName}','${element.Entity}',${myobj.OrganizationID}, 1)
                         `;
            }
            else {
                query += `update DefaultColumns set ColumnName = '${element.ColumnName}' where Id = ${element.Id}
                         `;
            }
        };
        console.log(query);
        sql.connect(config).then(() => {
            return sql.query` exec (${query})`;
        }).then(result => {
            sql.close();
            return callback(null, result);
        }).catch(err => {
            sql.close();
            return callback(null, err);
        })
    }).catch(err => {
        sql.close();
        return callback(null, err);
    })
}


