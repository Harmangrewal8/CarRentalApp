//jshint esversion:6

const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded());


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '8898',
    database: 'carrentalschema',
    insecureAuth: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
        
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.listen(3000, () => console.log('Express server is running at port no : 3000'));

    app.use(express.static('public'))

      


app.get('/result', (req, res) => {
});

app.post('/result', (req, res) => {
    var userLocation = req.body.userlocation;
    var fromDate = (req.body.fromDate);
    var fromTime = req.body.fromTime;
    var toDate = req.body.toDate;
    var toTime = req.body.toTime;
    var types = req.body.types;
    console.log(fromDate+" "+fromTime);
    console.log(toDate+" "+toTime);

    
    mysqlConnection.query('SELECT * FROM car WHERE location = ?', [userLocation], (err, rows, fields) => {
        if (!err){
            if(res == null){
                res.send("oops");
            }
            else {
                 res.render("cars", { data: rows });
            }
        }
           
        else
            console.log(err);
    })
    
});




