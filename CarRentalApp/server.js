//jshint esversion:6

const express = require("express");

const app = express();
app.use(express.static("./public"));




app.get('/', function(req, res) {

});

app.listen(3000, function(){
  console.log("server started on port 3000")
});
