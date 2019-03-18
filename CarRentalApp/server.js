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

app.post('/result', (req, res) => {
    userLocation = req.body.userlocation;
    var fromDate = (req.body.fromDate);
    var fromTime = req.body.fromTime;
    var toDate = req.body.toDate;
    var toTime = req.body.toTime;
    var types = req.body.types;
    console.log(fromDate+" "+fromTime);
    console.log(toDate+" "+toTime);
    

    console.log("User: "+req.session.username);
    console.log("logged in: "+req.session.loggedin);

if(req.session.loggedin == true){
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

}
  else{
      res.send("Please Log in or Sign Up");
      
  }  
   
    
});


///type filter
app.get('/type', (req, res) => {
});


app.post('/type', (req, res) => {
    
    console.log(userLocation);
    var types = req.body.types;
    if(types == null){
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
    }
    else{
        mysqlConnection.query('SELECT car.carType, name, brandName, carStatus, location, rates.weekly, rates.hourly, rates.daily from car inner join rates on car.carType = rates.carType WHERE ( car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? ) AND location = ?', [types[0],types[1],types[2],types[3],types[4],types[5],types[6],types[7],types[8],userLocation], (err, rows, fields) => {
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

    }
    
    
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