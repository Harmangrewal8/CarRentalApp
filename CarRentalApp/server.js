//jshint esversion:6

const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
var session = require('express-session');



app.set("view engine", "ejs");

app.use(bodyparser.urlencoded());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(function(req, res, next) {
    res.locals.status = req.session.loggedin;
    res.locals.user = req.session.username;
    res.locals.msg = req.session.msg;
    next();
  });

//mysql connection
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

//user registration    
app.get('/register', (req, res) => {
    res.render("register.ejs");

});


app.post('/register', (req, res) => {
    var user = req.body.reguser;
    var pass = req.body.pass1;
    if(pass == req.body.pass2){
        if (user && pass) {
            mysqlConnection.query('SELECT * FROM customer WHERE username = ? ', [user], function(error, results, fields) {
                if (results.length > 0) {
                    res.send('User already exists for this username');
        
                } else {
                    mysqlConnection.query('INSERT INTO customer (username, password) VALUES (?,?) ', [user, pass], function(error, results, fields){
    
                    });
                    res.redirect('/login');
                }			
                res.end();
            });
        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }

    }
	else{
        res.send("pass does not match");
    }
});
//user auth
app.get('/login', (req, res) => {
    res.render("login.ejs");

});


app.post('/login', (req, res) => {
    var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		mysqlConnection.query('SELECT * FROM customer WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

//searchg result

app.get('/result', (req, res) => {
    
});

var userLocation;
var diffDays;
var weeks;
var dayrem;
var hours;
app.post('/result', (req, res) => {
    userLocation = req.body.userlocation;
    var fromDate = (req.body.fromDate);
    var fromTime = req.body.fromTime;
    var toDate = (req.body.toDate);
    var toTime = req.body.toTime;
 
    console.log(fromDate+" "+fromTime);
    console.log(toDate+" "+toTime);
    
//calculating days

    var firstDate = new Date(fromDate.replace('-' , '/'));
    var secondDate = new Date(toDate.replace('-' , '/'));    
    diffDays = Math.abs((firstDate.getTime() - secondDate.getTime()) / 86400000);
   

//calculating hours and mins   
        fromTime = fromTime.split(":");
        toTime = toTime.split(":");
        var startDate = new Date(0, 0, 0, fromTime[0], fromTime[1], 0);
        var endDate = new Date(0, 0, 0, toTime[0], toTime[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        hours = Math.floor(diff / 1000 / 60 / 60);
        diff = hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / 1000 / 60);

        if (hours < 0)
           {hours = hours + 24;}
    else{
        

        console.log(("days: "+ diffDays+" hours: "+ hours +" minutes: "+ minutes));

        //finally calculating weeks and remaining days and hours
        weeks = Math.floor(diffDays/7);
        dayrem = diffDays % 7;

        }
    

    console.log("User: "+req.session.username);
    console.log("logged in: "+req.session.loggedin);
    if(req.session.loggedin == true){
        mysqlConnection.query('SELECT car.carType, name, brandName, carStatus, location, rates.weekly, rates.hourly, rates.daily, insurance.weeklyIn, insurance.hourlyIn, insurance.dailyIn from car inner join rates on car.carType = rates.carType inner join insurance on car.carType = insurance.carType WHERE location = ? ', [userLocation], (err, rows, fields) => {
            if (!err){
                if(res == null){
                    res.send("oops");
                }
                else {
                     res.render("cars", { data: rows , weeks: weeks, dayrem: dayrem, hours: hours});
                }
            }
               
            else
                console.log(err);
        })
    }
    else{
        res.redirect('/login');
    }
   
    
});


///type filter
app.get('/type', (req, res) => {
});


app.post('/type', (req, res) => {
    
    console.log(userLocation);
    var types = req.body.types;
    if(types == null){
        mysqlConnection.query('SELECT car.carType, name, brandName, carStatus, location, rates.weekly, rates.hourly, rates.daily, insurance.weeklyIn, insurance.hourlyIn, insurance.dailyIn from car inner join rates on car.carType = rates.carType left join insurance on car.carType = insurance.carType WHERE location = ? ', [userLocation], (err, rows, fields) => {
            if (!err){
                if(res == null){
                    res.send("oops");
                }
                else {
                    res.render("cars", { data: rows , weeks: weeks, dayrem: dayrem, hours: hours});
                }
            }
               
            else
                console.log(err);
        })
    }
    else{
        mysqlConnection.query('SELECT car.carType, name, brandName, carStatus, location, rates.weekly, rates.hourly, rates.daily from car inner join rates on car.carType = rates.carType WHERE ( car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? ) AND location = ?', [types[0],types[1],types[2],types[3],types[4],types[5],types[6],types[7],types[8],userLocation], (err, rows, fields) => {
            if (!err){
                if(res == null){
                    res.send("oops");
                }
                else {
                    
                    res.render("cars", { data: rows , weeks: weeks, dayrem: dayrem, hours: hours});
                }
            }
               
            else
                console.log(err);
        })

    }
    
    
});

//reserve car
app.get("/reserve", (req, res)=>{

});
app.post("/reserve", (req, res)=>{
    var cost = req.body.cost;
    res.send(cost);


});

//button routes
app.get('/all', (req, res) => {
    
    mysqlConnection.query('SELECT * FROM car ', [], (err, rows, fields) => {
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

app.post('/all', (req, res) => {
  
});