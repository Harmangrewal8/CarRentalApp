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

//Get all cars
app.get('/cars', (req, res) => {
   
  
    mysqlConnection.query('SELECT * FROM car', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.post('/', (req, res) => {
    var userLocation = req.body.userlocation;
    var fromDate = (req.body.fromDate);
    var fromTime = req.body.fromTime;
    var toDate = req.body.toDate;
    var toTime = req.body.toTime;
    var type = req.body.type;

   
    mysqlConnection.query('SELECT * FROM car WHERE carType = ? and location = ?', [type, userLocation], (err, rows, fields) => {
        if (!err){
            if(res == null){
                res.send("oops");

            }
            else {
                res.send(rows);

            }
        }
           
        else
            console.log(err);
    })

  
  
});



//:id
app.get('/cars/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM car WHERE carId = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

});


