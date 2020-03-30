const sql = require('mssql')
var soap = require('soap');
const utils = require('../utils/config')
const config = utils.config;
const serviceUrl = utils.url;
const masterData = require('../utils/masterData');

exports.validateUser = function validateUser(myobj, callback) {
    const OfficialEmailId = myobj.OfficialEmailId;
    const password = myobj.password;
    sql.connect(config).then(() => {
        return sql.query`SELECT a.EmployeeId, a.Name,a.EmpCode, a.JoiningDate,a.RelievingDate,a.BankAccountNumber,a.DateOfBirth,a.ContactNumber1,a.ContactNumber2,
        a.FatherName,a.CorrespondenceAddress,a.PermanentAddress,a.PersonalEmailId,a.OfficialEmailId,a.PanNumber,a.SkypeId,a.Status,a.Password,a.RoleId,a.CompanyId,a.IFSCCode,a.AdharCardNumber,a.OfficialEmailPassword,a.BloodGroup,a.OrganizationID
      FROM Employee a  inner join Organization c 
      on a.OrganizationID=c.Id where a.OfficialEmailId = ${OfficialEmailId} AND a.password = ${password} AND c.IsActive = 1`
    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close()
        return callback(null, err);
    })

}
exports.getEmployeesStatus = function getEmployeesStatus(myobj, callback) {
    sql.connect(config).then(() => {
        return sql.query`select Status, count(*) as StatusCount
        from Employee where OrganizationID = ${myobj.OrganizationID}
        group by Status`
    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close()
        return callback(null, err);
    })

}
exports.getEmployees = function getEmployees(myobj, callback) {
    var obj = {}
    var key = '';
    var defaultColumns = masterData.employeeDisplayColumnsDefault;
    sql.connect(config).then(() => {
        return sql.query`select em.EmployeeId,em.Name,em.EmpCode,em.DesignationId,em.DepartmentId ,em.JoiningDate,em.RelievingDate,em.BankAccountNumber,em.BankId,em.DateOfBirth,em.ContactNumber1
        ,em.ContactNumber2,em.FatherName,em.CorrespondenceAddress,em.PermanentAddress,em.PersonalEmailId
        ,em.PanNumber
        ,em.OfficialEmailId
        ,em.SkypeId
        ,em.Id
        ,em.Status
        ,em.Password
        ,em.RoleId
        ,em.CompanyId
        ,em.IFSCCode
        ,em.AdharCardNumber
        ,em.OfficialEmailPassword
        ,em.BloodGroup
        ,em.OrganizationID
        ,s.Name as Shift
        ,dp.Name As Department,
        CASE WHEN YEAR(em.JoiningDate) != YEAR(getdate()) AND  MONTH(em.JoiningDate) = MONTH(getdate()) THEN 1 ELSE 0 END  AS currentMonthAppraisal,
        de.Name As Designation from Employee em 
        left join Designation de on em.DesignationId = de.DesignationId 
        left join Department dp on em.DepartmentId = dp.DepartmentId 
        left join Shift s on em.ShiftId = s.ShiftId where em.OrganizationID = ${myobj.OrganizationID} ORDER BY em.EmployeeId DESC;`
    }).then(result => {
        sql.close();
        key = 'employees';
        obj[key] = result.recordset;
        sql.connect(config).then(() => {
            return sql.query`select * from DefaultColumns where orgId = ${myobj.OrganizationID}`
        }).then(result => {
            sql.close();
            key = 'defaultColumns';
            var columns = []
            if (result.recordset.length > 0) {
                columns = defaultColumns.filter((col) => col.IsEditable == false);
                for (var i = 0, l = result.recordset.length; i < l; i++) {
                    columns.push(result.recordset[i]);
                }
            }
            else {
                columns = defaultColumns;
            }
            obj[key] = columns;
            return callback(null, obj);
        }).catch(err => {
            sql.close()
            return callback(null, err);
        })
    }).catch(err => {
        sql.close()
        return callback(null, err);
    })
}
exports.getEmployeeDetails = function getEmployeeDetails(myobj, callback) {
    const EmployeeId = myobj.EmployeeId;
    sql.connect(config).then(() => {
        return sql.query`SELECT a.EmployeeId, a.Name,a.EmpCode,a.BankId,c.DesignationId,d.DepartmentId, a.JoiningDate,
        a.RelievingDate,a.BankAccountNumber,b.Name As BankName,a.DateOfBirth,a.ContactNumber1,a.ContactNumber2,
        a.FatherName,a.CorrespondenceAddress,a.PermanentAddress,a.PersonalEmailId,a.Id,a.OfficialEmailId,
        a.PanNumber,a.SkypeId,a.Status,a.Password,a.RoleId,a.CompanyId,a.IFSCCode,a.AdharCardNumber,a.OfficialEmailPassword,a.BloodGroup, s.ShiftId
      FROM Employee a  
      inner join Designation c on a.DesignationId=c.DesignationId 
      inner join Department d on a.DepartmentId = d.DepartmentId       
      inner join shift s on a.shiftId = s.shiftId       
      inner join Bank b on a.BankId = b.BankID where a.EmployeeId =  ${EmployeeId}`
    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close()
        return callback(null, err);
    })

}

exports.getTimingData = function getTimingData(myobj, callback) {
    var dateFrom = '' + myobj.DateForTimeSheet + ' 00:00:00'
    var dateTo = '' + myobj.DateForTimeSheet + ' 23:59:59';
    sql.connect(config).then(() => {
        if (myobj.SelectedEmployeeId) {
            return sql.query` SELECT  e.Name,e.EmpCode,Max(d.Name) as Designation,COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 AS IdleTime, 
            DATEDIFF(mi,MIN(DateOfScreenshot),CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot)  				
            THEN dateAdd(mi,10,MIN(DateOfScreenshot)) else Max(DateOfScreenshot) END) AS TimeDiff_Old, DATEDIFF(mi,MIN(DateOfScreenshot),CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot) THEN dateAdd(mi,10,MIN(DateOfScreenshot)) else Max(DateOfScreenshot) END) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork_Old,
            (Count(s.ID) * 10) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork,
        (Count(s.ID) * 10) as TimeDiff
           from Employee e inner join Designation d on e.DesignationId = d.DesignationId 
           left join Organization org on org.ID=e.OrganizationID
           left join ScreenShots s on e.EmpCode = s.EmpCode and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)
          BETWEEN ${dateFrom} AND ${dateTo} 
             where  e.EmpCode =  ${myobj.SelectedEmployeeId} AND e.Status = 1 AND e.OrganizationID =   ${myobj.OrganizationID}
    GROUP BY e.EmpCode,e.Name`;
        } else {
            if (myobj.active) {
                return sql.query` SELECT  e.Name,e.EmpCode,Max(d.Name) as Designation,COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 AS IdleTime, 
                DATEDIFF(mi,MIN(DateOfScreenshot),CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot)  				
                THEN dateAdd(mi,10,MIN(DateOfScreenshot)) else Max(DateOfScreenshot) END) AS TimeDiff_Old, DATEDIFF(mi,MIN(DateOfScreenshot),CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot) THEN dateAdd(mi,10,MIN(DateOfScreenshot)) else Max(DateOfScreenshot) END) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork_Old,
                (Count(s.ID) * 10) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork,
            (Count(s.ID) * 10) as TimeDiff
               from Employee e inner join Designation d on e.DesignationId = d.DesignationId 
               left join Organization org on org.ID=e.OrganizationID
               left join ScreenShots s on e.EmpCode = s.EmpCode and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)
              BETWEEN ${dateFrom} AND ${dateTo} 
                 where  e.Status = 1 AND e.OrganizationID =   ${myobj.OrganizationID}
        GROUP BY e.EmpCode,e.Name`;
            } else {
                return sql.query` SELECT  e.Name,e.EmpCode,Max(d.Name) as Designation,COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 AS IdleTime, 
                DATEDIFF(mi,MIN(DateOfScreenshot),CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot)  				
                THEN dateAdd(mi,10,MIN(DateOfScreenshot)) else Max(DateOfScreenshot) END) AS TimeDiff_Old, DATEDIFF(mi,MIN(DateOfScreenshot),CASE WHEN MIN(DateOfScreenshot) = MAX(DateOfScreenshot) THEN dateAdd(mi,10,MIN(DateOfScreenshot)) else Max(DateOfScreenshot) END) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork_Old,
                (Count(s.ID) * 10) - COUNT(CASE WHEN s.KeyStrokes+s.MouseStrokes = 0 THEN 1 END) * 10 As ActualWork,
            (Count(s.ID) * 10) as TimeDiff
               from Employee e inner join Designation d on e.DesignationId = d.DesignationId 
               left join Organization org on org.ID=e.OrganizationID
               left join ScreenShots s on e.EmpCode = s.EmpCode and dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,org.TimeZone)),s.DateOfScreenshot)
              BETWEEN ${dateFrom} AND ${dateTo} 
                 where  e.Status = 0 AND e.OrganizationID =   ${myobj.OrganizationID}
        GROUP BY e.EmpCode,e.Name`;
            }

        }

    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close()
        return callback(null, err);
    })
}

exports.getAllListData = function getAllListData(myobj, callback) {
    var obj = {}
    var key = '';
    sql.connect(config).then(() => {
        return sql.query`select Max(EmployeeId) AS EmployeeId,(select Max(Id) from Employee where OrganizationID=${myobj.OrganizationID}) AS Id from Employee;`
    }).then(result => {
        sql.close()
        key = 'LastEmployeeId'
        obj[key] = result.recordset
        sql.connect(config).then(() => {
            return sql.query`select * from Designation where OrganizationID = ${myobj.OrganizationID}`
        }).then(result => {
            key = 'Designation'
            sql.close()
            obj[key] = result.recordset
            sql.connect(config).then(() => {
                return sql.query`select * from Department where OrganizationID = ${myobj.OrganizationID}`
            }).then(result => {
                sql.close()
                key = 'Department'
                obj[key] = result.recordset
                sql.connect(config).then(() => {
                    return sql.query`select * from Bank`
                }).then(result => {
                    sql.close()
                    key = 'Bank'
                    obj[key] = result.recordset
                    sql.connect(config).then(() => {
                        return sql.query`select * from Organization where ID = ${myobj.OrganizationID}`
                    }).then(result => {
                        sql.close()
                        key = 'Organization'
                        obj[key] = result.recordset
                        sql.connect(config).then(() => {
                            return sql.query`select * from EmployeeRoles`
                        }).then(result => {
                            sql.close()
                            key = 'EmployeeRoles'
                            obj[key] = result.recordset
                            //return callback(null, obj);
                            sql.connect(config).then(() => {
                                return sql.query`select * from Shift where OrganizationID = ${myobj.OrganizationID}`
                            }).then(result => {
                                sql.close()
                                key = 'Shift'
                                obj[key] = result.recordset
                                return callback(null, obj);
                            }).catch(err => {
                                sql.close()
                                return callback(null, obj);
                            })
                        }).catch(err => {
                            sql.close()
                            return callback(null, obj);
                        })
                    }).catch(err => {
                        sql.close()
                        return callback(null, obj);
                    })
                }).catch(err => {
                    sql.close()
                    return callback(null, obj);
                })
            }).catch(err => {
                sql.close()
                return callback(null, obj);
            })
        }).catch(err => {
            sql.close()
            return callback(null, err);
        })
    }).catch(err => {
        sql.close()
        return callback(null, obj);
    })


}
exports.checkEmailExist = function checkEmailExist(myobj, callback) {
    sql.connect(config).then(() => {
        return sql.query` select EmployeeId from employee where OfficialEmailId = ${myobj.OfficialEmailId}`
    }).then(result => {
        sql.close()
        return callback(null, result.recordset);
    }).catch(err => {
        sql.close()
        return callback(null, err);
    })
}
exports.addEmployee = function addEmployee(myobj, callback) {
    if (myobj.action == "add") {
        sql.connect(config).then(() => {
            return sql.query`INSERT INTO [Employee] ([EmployeeId]
                ,[Id]
                ,[Name]
                ,[EmpCode]
                ,[DesignationId]
                ,[DepartmentId]
                ,[JoiningDate]
                ,[BankAccountNumber]
                ,[BankId]
                ,[DateOfBirth]
                ,[ContactNumber1]
                ,[ContactNumber2]
                ,[FatherName]
                ,[CorrespondenceAddress]
                ,[PermanentAddress]
                ,[PersonalEmailId]
                ,[PanNumber]
                ,[OfficialEmailId]
                ,[SkypeId]
                ,[Status]
                ,[Password]
                ,[RoleId]
                ,[CompanyId]
                ,[IFSCCode]
                ,[AdharCardNumber]
                ,[OfficialEmailPassword]
                ,[BloodGroup]
                ,[OrganizationID]
                ,[ShiftId])  
            VALUES (${myobj.EmployeeIdForSave},
                ${myobj.EmployeeId},
                ${myobj.Name},
                ${myobj.EmpCode},
                ${myobj.DesignationId},
                ${myobj.DepartmentId},
                ${myobj.JoiningDate},
                ${myobj.BankAccountNumber},
                ${myobj.BankId},
                ${myobj.DateOfBirth},
                ${myobj.ContactNumber1},
                ${myobj.ContactNumber2},
                ${myobj.FatherName},
                ${myobj.CorrespondenceAddress},
                ${myobj.PermanentAddress},
                ${myobj.PersonalEmailId},
                ${myobj.PanNumber},
                ${myobj.OfficialEmailId},
                ${myobj.SkypeId},
                ${myobj.Status},
                ${myobj.Password},
                ${myobj.RoleId},
                ${myobj.CompanyId},
                ${myobj.IFSCCode},
                ${myobj.AdharCardNumber},
                ${myobj.OfficialEmailPassword},
                ${myobj.BloodGroup},
                ${myobj.OrganizationID},
                ${myobj.ShiftId});`
        }).then(result => {
            sql.close()
            return callback(null, result);
        }).catch(err => {
            sql.close()
            return callback(null, err);
        })
    } else {
        sql.connect(config).then(() => {
            return sql.query`UPDATE [Employee] SET
            [Name] =  ${myobj.Name}
                ,[DesignationId] =  ${myobj.DesignationId}
                ,[DepartmentId] =  ${myobj.DepartmentId}
                ,[JoiningDate] =  ${myobj.JoiningDate}
                ,[BankAccountNumber] =  ${myobj.BankAccountNumber}
                ,[BankId] =  ${myobj.BankId}
                ,[DateOfBirth] =  ${myobj.DateOfBirth}
                ,[ContactNumber1] =  ${myobj.ContactNumber1}
                ,[ContactNumber2] =  ${myobj.ContactNumber2}
                ,[FatherName] =  ${myobj.FatherName}
                ,[CorrespondenceAddress] =  ${myobj.CorrespondenceAddress}
                ,[PermanentAddress] =  ${myobj.PermanentAddress}
                ,[PersonalEmailId] =  ${myobj.PersonalEmailId}
                ,[PanNumber] =  ${myobj.PanNumber}
                ,[OfficialEmailId] =  ${myobj.OfficialEmailId}
                ,[SkypeId] =  ${myobj.SkypeId}
                ,[Status] =  ${myobj.Status}
                ,[Password] =  ${myobj.Password}
                ,[RoleId] =  ${myobj.RoleId}
                ,[CompanyId] =  ${myobj.CompanyId}
                ,[IFSCCode] =  ${myobj.IFSCCode}
                ,[AdharCardNumber] =  ${myobj.AdharCardNumber}
                ,[OfficialEmailPassword] =  ${myobj.OfficialEmailPassword}
                ,[BloodGroup] =  ${myobj.BloodGroup}
                ,[ShiftId] =  ${myobj.ShiftId}
            WHERE EmployeeId = ${myobj.EmployeeIdForSave}`
        }).then(result => {
            sql.close()
            return callback(null, result);
        }).catch(err => {
            sql.close()
            return callback(null, err);
        })
    }

}
exports.deleteEmployee = function deleteEmployee(myobj, callback) {
    sql.connect(config).then(() => {
        return sql.query`delete from Employee where EmployeeId = ${myobj.EmployeeId} AND OrganizationID = ${myobj.OrganizationID}`
    }).then(result => {
        sql.close()
        return callback(null, result);
    }).catch(err => {
        sql.close()
        return callback(null, err);
    })
}
exports.getEmployeeScreens = function getEmployeeScreens(myobj, callback) {
    sql.connect(config).then(() => {
        return sql.query`select shiftId from employee where EmpCode= ${myobj.EmpCode}`
    }).then(result => {
        sql.close()
        debugger;
        var dateFrom = '' + myobj.DateForTimeSheet + ' 00:00:00'
        var dateTo = '' + myobj.NextDateForTimeSheet + ' 23:59:59';

        sql.connect(config).then(() => {
            return sql.query`SELECT ss.EmpCode, dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot, o.TimeZone)),ss.DateOfScreenshot)
        AS DateOfScreenshot,ss.DateOfScreenshot AS ActualUTC, cast(datepart(day,ss.DateOfScreenshot) as varchar(10)) + cast(datepart(month,ss.DateOfScreenshot) as varchar(10)) + cast(datepart(year,ss.DateOfScreenshot) as varchar(10))  AS ImgFolder,
           DATEPART(HOUR,dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot,o.TimeZone)),ss.DateOfScreenshot))
         AS Hour,ss.ImageName,ss.IsIdleTime,ss.KeyStrokes,ss.MouseStrokes FROM dbo.ScreenShots ss
          left join  dbo.Organization o on ss.OrganizationID = o.ID WHERE ss.EmpCode= ${myobj.EmpCode}
           AND  dateadd(MINUTE,datepart(tz, SWITCHOFFSET(DateOfScreenshot, o.TimeZone)),ss.DateOfScreenshot)
            BETWEEN ${dateFrom} AND ${dateTo}
             AND ss.ImageName IS NOT NULL AND ss.OrganizationID =   ${myobj.OrganizationID}`
        }).then(result => {
            sql.close()
            return callback(null, result.recordset);
        }).catch(err => {
            sql.close()
            return callback(null, err);
        })
    }).catch(err => {
        sql.close()
        return callback(null, err);
    })
}
exports.getEmployeeImageBase64 = function getEmployeeImageBase64(myobj, callback) {
    soap.createClient(serviceUrl, function (err, client) {
        client.GetEmployeeImageBase64(myobj, function (err, result) {
            if (err) {
                return callback(null, err);;
            }
            return callback(null, result);
        });
    });
}
