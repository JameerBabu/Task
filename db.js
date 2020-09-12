var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


var express=require("express"); 
var bodyParser=require("body-parser"); 

var app=express();

var path = require('path');




app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
	extended: true
}));

var ans = {};

app.post('/db.js', function(req,res){ 
	var search = req.body.search; 

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  
  var dbo = db.db("mydb");

  dbo.collection("query").find( {$or:[{tags:{$regex: search, $options:"i"} }, {question:{$regex: search, $options:"i"} }]}  , { projection: {_id: 0, question: 1 } }).toArray(function(err, result) {
   if (err) throw err;
   
    console.log(result);
    ans = result;
    db.close();
  });
});

res.send('Data received:\n' + JSON.stringify(ans));	
	 
});


const port = 8081;

app.listen(port, () => {
  console.log(`Server running on port${port}`);
});
