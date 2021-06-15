const express= require('express');
const router= express.Router();
const mysqlConnection = require('../db');

//Get all shortcodes
router.get('/',(req,res)=>{
    mysqlConnection.query('SELECT * FROM shortcode',(err,rows,fields)=>{
        if(err)
            return res.status(404).send('Not Found');
        
        return res.send(rows);
    })
});

//Get a shortcode
router.get('/:id',(req,res)=>{

    const query= "UPDATE shortcode SET ? &&  WHERE shortcode = ?";

    mysqlConnection.query(`SELECT * FROM shortcode WHERE shortcode = ?`,[req.params.id],async(err,rows,fields)=>{
        if(err)
            return res.status(404).send('Not Found');

        mysqlConnection.query(query,[{lastSeenDate: new Date()},req.params.id],(error,info,fields)=>{
            if(error)
                return res.status(404).send(error);

            return res.send('Updated');
        });
    })
});

//Get uri from shortcode
router.get('/:shortcode',(req,res)=>{

    const query= "UPDATE shortcode SET ? &&  WHERE shortcode = ?";

    mysqlConnection.query(`SELECT * FROM shortcode WHERE shortcode = ?`,[req.params.shortcode],async(err,rows,fields)=>{
        if(err)
            return res.status(404).send({ERROR:'Shortcode is not found in the system'});

        mysqlConnection.query(query,[{lastSeenDate: new Date()},req.params.id],(error,info,fields)=>{
            if(error)
                return res.status(404).send(error);

            return res.send('Updated');
        });
    })
});

//Delete a shortcode
router.delete('/:id',(req,res)=>{
    mysqlConnection.query(`DELETE FROM shortcode WHERE EmpID = ?`,[req.params.id],(err,rows,fields)=>{
        if(err)
            return res.status(404).send('Not Found');
        
        return res.send('Deleted Successfully');
    })
});

//Insert a shortcode
router.post('/shorten',(req,res)=>{
    const {shortcode,url}= req.body;

    const regex= /^[0-9a-zA-Z_]{4,}$/;

    console.log(shortcode.match(regex));
    

    if(shortcode===url.substring(url.lastIndexOf('/')+1,url.lastIndexOf('.')))
        return res.status(201).send({shortcode:""});

    if(!url)
        return res.status(400).send({Error:'Url not present'});

    if(!shortcode.match(regex))
        return res.status(422).send({shortcode:"shortcode fails to meet the following regexp"});

    var sql= "INSERT INTO shortcode VALUES (?,?,?,?,?)";

    mysqlConnection.query(sql,[shortcode,url,new Date(),null,0],(err,rows,fields)=>{
        
        if(err)
            return res.status(409).send({ERROR:"Desired shortcode is already in use"});
        
        res.send('Added')
    })
});

//Updating a shortcode
router.patch('/:id',(req,res)=>{
    var emp= req.body;
    console.log(emp);
    var sql= "SET @EmpID=?;SET @Name=?;SET @EmpCode=?;SET @Salary=?;\
              CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary)";

    mysqlConnection.query(sql,[req.params.id, emp.Name, emp.EmpCode, emp.Salary],(err,rows,fields)=>{
        if(err)
            return res.status(404).send('Error in Updating');
        
        return res.send('Updating Successfully');
    })
});

module.exports= router;