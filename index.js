const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const mysqlConnection = require('./db');
const urlRoutes = require('./routes/urlRoutes');

mysqlConnection.connect((err)=>{
    if(err)
        console.log('DB connection failed:'+JSON.stringify(err,undefined,2));
    else
        console.log('DB Connection succedded')
});

app.use(bodyparser.json());
app.use('/',urlRoutes);

app.listen(8000,()=>console.log('Express Server is running...'));
