var express = require('express');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// DB connections
var adrName = "finaladdr.sqlite";
var tsName = "timeseries.sqlite";


var adrDB = new sqlite3.Database(adrName, sqlite3.OPEN_READONLY, function(err){
  if(err) console.log(err);
  console.log("adrDB open for business");
});
var tsDB = new sqlite3.Database(tsName, sqlite3.OPEN_READONLY, function(err){
  if(err) console.log(err);
  console.log("TimeseriesDB reporting for duty");
});


// REST
app.get("/", function(req, res){
  console.log("A Okay so far");
  return(res);
});

app.get("/getbyid", function(req, res){
  // Get points from tsDB corresponding to some ID
  console.log(req.query);
  var id = req.query.id;

  adrDB.all("SELECT * FROM marker WHERE ID=$incid", {$incid: id}, function(err, rows){
    console.log("Success!");
    res.json(rows);
  });

});

app.get("/adr", function(req, res){
  // Send back information from row corresponding to address
  console.log(req.query);
  var adrString = req.query.adresse + "%";
  adrDB.all("SELECT * FROM marker WHERE Adresse LIKE $adr", {$adr: adrString}, function(err, rows){
    console.log(rows.length);
    res.json(rows);
  });
});


app.get("/cvr", function(req, res){
  // Send back information from row corresponding to address
  console.log(req.query);
  var cvrString = req.query.cvr + "%";
  adrDB.all("SELECT * FROM marker WHERE CVR LIKE $cvr", {$cvr: cvrString}, function(err, rows){
    console.log(rows.length);
    res.json(rows);
  });
});

app.get("/timeseries", function(req, res){
  var id = req.query.id;
  tsDB.all("SELECT * FROM timeseries WHERE ID = $incid", {$incid:id}, function(err, rows){
    res.json(rows);
  });
});


var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log("Listening on http://localhost:%s", port);
});
