const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Arjit222830@',
    database: 'TinyURL',
    multipleStatements: true
});

module.exports = mysqlConnection;