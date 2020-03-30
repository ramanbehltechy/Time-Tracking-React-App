// exports.url = 'http://103.231.77.115:8080/TrackerService.svc?wsdl';   //for production
// exports.config = {
//     user: 'sa',
//     password: 'Hosting@123',
//     server: '103.231.77.115\\\SQLExpress', // You can use 'localhost\\instance' to connect to named instance
//     database: 'HRMS',
// connectionTimeout: 300000,
// requestTimeout: 300000,
// pool: {
//    idleTimeoutMillis: 300000,
//    max: 100
// },
//     options: {
//         encrypt: true // Use this if you're on Windows Azure
//     }
// }

exports.url = 'http://server:10025/TrackerService.svc?wsdl';  //for local
exports.config = {
    user: 'sa',
    password: 'Hosting@123',
    server: 'Server', // You can use 'localhost\\instance' to connect to named instance
    database: 'HRMS2',
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
        idleTimeoutMillis: 300000,
        max: 100
    },
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}