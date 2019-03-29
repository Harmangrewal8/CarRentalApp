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
    var key="";
    res.render("register.ejs",{key:key});

});


app.post('/register', (req, res) => {
    var user = req.body.reguser;
    var pass = req.body.pass1;
    
    var phone = req.body.phone;
    if(pass == req.body.pass2){
        if (user && pass) {
            mysqlConnection.query('SELECT * FROM customer WHERE username = ? OR phone = ? ', [user, phone ], function(error, results, fields) {
                if (results.length > 0) {
                    var key="exists";
                    res.render('register.ejs', {key:key});
        
                } else {
                    mysqlConnection.query('INSERT INTO customer (username, password,phone) VALUES (?,?,?) ', [user, pass, phone], function(error, results, fields){
    
                    });
                    var key="";
                    res.render('login.ejs', {key:key});
                }			
                res.end();
            });
        } else {
            var key="empty";
                    res.render('register.ejs', {key:key});
            res.end();
        }

    }
	else{
        var key="match";
                    res.render('register.ejs', {key:key});
    }
});
//user auth
app.get('/login', (req, res) => {
    var key ="";
    res.render("login.ejs",{key:key});

});


app.post('/login', (req, res) => {
    var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		mysqlConnection.query('SELECT * FROM customer WHERE username = ? AND password = ? UNION SELECT * FROM admin WHERE username = ? AND password = ? ', [username, password, username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
                req.session.username = username;
                req.session.phone = results[0]["phone"];
                key = "logged";
				res.render('index.ejs',{key:key});
			} else {
                key="incorrect";
                res.render("login.ejs", {key:key});
			}			
			res.end();
		});
	} else {
		key="empty";
                res.render("login.ejs", {key:key})
	}
});

//logout
app.get('/logout', (req, res) => {
    if(req.session.loggedin==true){
        req.session.loggedin = false;
                req.session.username = null;
                key = "out";
				res.render('index.ejs',{key:key});
    }else{
        key = "none";
        res.render('index.ejs',{key:key});
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
var fromDate ;
  var fromTime ;
  var toDate;
 var toTime;

 //changed format
 var firstDate;
 var secondDate;
 
app.post('/result', (req, res) => {
    userLocation = req.body.userlocation;
     fromDate = (req.body.fromDate);
     fromTime = req.body.fromTime;
     toDate = (req.body.toDate);
     toTime = req.body.toTime;
 
    console.log(fromDate+" "+fromTime);
    console.log(toDate+" "+toTime);
    
//calculating days

 firstDate = new Date(fromDate.replace('-' , '/'));
 secondDate = new Date(toDate.replace('-' , '/'));    
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
        mysqlConnection.query('SELECT car.carType,carId, name, brandName, carStatus, location, rates.weekly, rates.hourly, rates.daily, insurance.weeklyIn, insurance.hourlyIn, insurance.dailyIn from car inner join rates on car.carType = rates.carType inner join insurance on car.carType = insurance.carType WHERE location = ? ', [userLocation], (err, rows, fields) => {
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
        var key="";
        res.render('login.ejs',{key:key});
    }
   
    
});


///type filter
app.get('/type', (req, res) => {
});


app.post('/type', (req, res) => {
    
    console.log(userLocation);
    var types = req.body.types;
    if(types == null){
        mysqlConnection.query('SELECT car.carType, carId, name, brandName, carStatus, location, rates.weekly, rates.hourly, rates.daily, insurance.weeklyIn, insurance.hourlyIn, insurance.dailyIn from car inner join rates on car.carType = rates.carType inner join insurance on car.carType = insurance.carType WHERE location = ? ', [userLocation], (err, rows, fields) => {
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
        mysqlConnection.query('SELECT car.carType, carId, name, brandName, carStatus, location, rates.weekly, rates.hourly, rates.daily, insurance.weeklyIn, insurance.hourlyIn, insurance.dailyIn from car inner join rates on car.carType = rates.carType inner join insurance on car.carType = insurance.carType WHERE ( car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? ) AND location = ?', [types[0],types[1],types[2],types[3],types[4],types[5],types[6],types[7],types[8],userLocation], (err, rows, fields) => {
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
    var insurance = req.body.insurance;
    var carId = req.body.carId;
    var carType = req.body.carType;
    var name = req.body.name;
    var carStatus = req.body.carStatus;
    var brandName = req.body.brandName;

    
    mysqlConnection.query('INSERT INTO reservation (username, carId, fromDate, toDate, phone, cost, costIn) VALUES (?,?,?,?,?,?,?)', [req.session.username,carId,firstDate,secondDate, req.session.phone,cost,insurance], (err, rows, fields) => {
        if (!err){
            if(res == null){
                res.send("oops"); 
            }
            else {
                mysqlConnection.query('SELECT LAST_INSERT_ID()', [], (err, rows, fields) => {
                    if (!err){
                        if(res == null){
                            res.send("oops");
                        }
                        else {
                            var key = "";
                            res.render("reservation.ejs", { key:key,cost:cost, insurance:insurance, data: rows,phone:req.session.phone, userLocation: userLocation, brandName:brandName, name:name, carType:carType, carStatus: carStatus, weeks: weeks, dayrem: dayrem, hours: hours, carId: carId});
                        }
                    }
                       
                    else
                        console.log(err);
                })
                
            }
        }
           
        else
            console.log(err);
    })


});
//cancel reservation
app.get("/cancelled", (req, res)=>{

});
app.post("/cancelled", (req, res)=>{
    var cost = req.body.cost;
    var insurance = req.body.insurance;
    var carId = req.body.carId;
    var carType = req.body.carType;
    var name = req.body.name;
    var carStatus = req.body.carStatus;
    var brandName = req.body.brandName;
    var resId = req.body.resId;
mysqlConnection.query("DELETE FROM reservation WHERE resId = ?", [resId], (err, rows, fields) => {
    if (!err){
        var key= "success";
        res.render("cancel.ejs", { key:key, cost:cost,resId:resId, insurance:insurance, data: rows,phone:req.session.phone, userLocation: userLocation, brandName:brandName, name:name, carType:carType, carStatus: carStatus, weeks: weeks, dayrem: dayrem, hours: hours, carId: carId});

    }
       
    else
        console.log(err);
})
                });
    
//search reservation
app.get("/reservations", (req, res)=>{
    var key= "";
    
     res.render("bookings.ejs", {key:key});

});
app.post("/reservations", (req, res)=>{

var input= req.body.input;
mysqlConnection.query("select * from car inner join reservation on car.carId = reservation.carId where reservation.resId=? OR reservation.phone=?", [input,input], (err, rows, fields) => {
    if (!err){
        if(res == null){
            res.send("oops"); 
        }
        else {
            
            var key= "success";
            res.render("bookings.ejs", {key:key,data:rows });

        }
    }
       
    else
        console.log(err);
})

});
//rent details
app.get("/rentinfo", (req, res)=>{

});
app.post("/rentinfo", (req, res)=>{

var phone= req.body.phone;
var resId = req.body.resId;
var carId = req.body.carId;
var name = req.body.name;

var carStatus = req.body.carStatus;


var cost = req.body.cost;
var insurance = req.body.insurance;
    var carType = req.body.carType;

    var brandName = req.body.brandName;
    var key ="";
res.render("rentinfo.ejs", {key:key, carStatus:carStatus, resId:resId,name:name,cost:cost, insurance:insurance, carType:carType, brandName:brandName, phone:phone,  weeks: weeks, dayrem: dayrem, hours: hours, carId: carId});

});


//rent car
app.get("/rent", (req, res)=>{

});
app.post("/rent", (req, res)=>{
      //from payment fields
      var cardNo= req.body.cardNo;
      var typecard= req.body.typecard;
      var expiry= req.body.expiry;
      var cvc= req.body.cvc;
      var liNo= req.body.liNo;

var phone= req.body.phone;
var resId = req.body.resId;
var carId = req.body.carId;
var name = req.body.name;
var carStatus = req.body.carStatus;


var cost = req.body.cost;
var insurance = req.body.insurance;
    var carType = req.body.carType;

    var brandName = req.body.brandName;
    console.log(userLocation);
    mysqlConnection.query('INSERT INTO rental (resId, phone, licenseNo, cardType, cardNo, expiry, cvc  ) VALUES (?,?,?,?,?,?,?)', [resId, req.session.phone, liNo,typecard, cardNo, expiry, cvc], (err, rows, fields) => {
        if (!err){
            if(res == null){
                res.send("oops"); 
            }
            else {
                //cancelling reservation when renting
                mysqlConnection.query("DELETE FROM reservation WHERE resId = ?", [resId], (err, rows, fields) => {

                });
                var key= "rent";
                res.render("index.ejs", {key:key});

            }
        }
           
        else
            console.log(err);
    })


});


//admin tools
app.get('/admin', (req, res) => {
    res.render("admin.ejs");

});
app.post('/admin', (req, res) => {

});

  //editcars
app.get('/editcars', (req, res) => {
    
});
 
app.post('/editcars', (req, res) => {
    if(req.session.loggedin == true){
        mysqlConnection.query('SELECT * from admin where username=?', [req.session.username], (err, rows, fields) => {
            if(rows.length >0){
                mysqlConnection.query('SELECT car.carType,carId, name, brandName, carStatus, location, rates.weekly, rates.hourly, rates.daily, insurance.weeklyIn, insurance.hourlyIn, insurance.dailyIn from car inner join rates on car.carType = rates.carType inner join insurance on car.carType = insurance.carType ', [], (err, rows, fields) => {
                    if (!err){
                        if(rows==null){
                            res.send("oops");
                        }
                        else {
                             res.render("editcars.ejs", { data: rows , weeks: weeks, dayrem: dayrem, hours: hours});
                        }
                    }
                       
                    else
                        console.log(err);
                })
            }
            else{
                var key ="notadmin";
                            res.render("login.ejs",{key:key})
            }
           
        }); 
    }
   else{
       var key ="";
       res.render("login.ejs",{key:key});
   }
});
 //type filter

 ///typeedit filter
app.get('/typeedit', (req, res) => {
});


app.post('/typeedit', (req, res) => {
    
    console.log(userLocation);
    var types = req.body.types;
    if(types == null){
        mysqlConnection.query('SELECT car.carType, carId, name, brandName, carStatus, location, rates.weekly, rates.hourly, rates.daily, insurance.weeklyIn, insurance.hourlyIn, insurance.dailyIn from car inner join rates on car.carType = rates.carType inner join insurance on car.carType = insurance.carType', [], (err, rows, fields) => {
            if (!err){
                if(res == null){
                    res.send("oops");
                }
                else {
                    res.render("editcars.ejs", { data: rows , weeks: weeks, dayrem: dayrem, hours: hours});
                }
            }
               
            else
                console.log(err);
        })
    }
    else{
        mysqlConnection.query('SELECT car.carType, carId, name, brandName, carStatus, location, rates.weekly, rates.hourly, rates.daily, insurance.weeklyIn, insurance.hourlyIn, insurance.dailyIn from car inner join rates on car.carType = rates.carType inner join insurance on car.carType = insurance.carType WHERE ( car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? OR car.carType = ? )', [types[0],types[1],types[2],types[3],types[4],types[5],types[6],types[7],types[8]], (err, rows, fields) => {
            if (!err){
                if(res == null){
                    res.send("oops");
                }
                else {
                    
                    res.render("editcars.ejs", { data: rows , weeks: weeks, dayrem: dayrem, hours: hours});
                }
            }
               
            else
                console.log(err);
        })

    }
    
    
});

//update record
app.get('/update', (req, res) => {
    
});
 
app.post('/update', (req, res) => {
    var name =req.body.name;
    var type =req.body.type;
    var status =req.body.status;
    var brand =req.body.brand;
    var cardId =req.body.carId;

    var weekly =req.body.weekly;
    var daily =req.body.daily;
    var hourly =req.body.hourlyIn;
    var weeklyIn =req.body.weeklyIn;
    var dailyIn =req.body.dailyIn;
    var hourlyIn =req.body.hourlyIn;

   
    
    mysqlConnection.query("UPDATE car inner join rates on car.carType = rates.carType inner join insurance on car.carType = insurance.carType SET car.carStatus = ?, rates.weekly = ?, rates.daily = ?,rates.hourly = ?,insurance.weeklyIn = ?,insurance.dailyIn = ?,insurance.hourlyIn = ? WHERE carId=?", [status,weekly,daily,hourly,weeklyIn,dailyIn,hourlyIn,cardId], (err, rows, fields) => {
        if (!err){
            if(res == null){
                res.send("oops");
            }
            else {
                
                mysqlConnection.query('SELECT car.carType,carId, name, brandName, carStatus, location, rates.weekly, rates.hourly, rates.daily, insurance.weeklyIn, insurance.hourlyIn, insurance.dailyIn from car inner join rates on car.carType = rates.carType inner join insurance on car.carType = insurance.carType ', [], (err, rows, fields) => {
                    if (!err){
                        if(rows==null){
                            res.send("oops");
                        }
                        else {
                             res.render("editcars.ejs", { data: rows , weeks: weeks, dayrem: dayrem, hours: hours});
                        }
                    }
                       
                    else
                        console.log(err);
                })
            }
        }
           
        else
            console.log(err);
    })


        
});

//update record
app.get('/clerk', (req, res) => {
    res.render("clerk.ejs");
});
 
app.post('/calculate', (req, res) => {
  res.send("total cost");
    
        
});


//button routes
