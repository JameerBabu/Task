var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var os = require("os");


var express=require("express"); 
var bodyParser=require("body-parser"); 

var app=express();

var path = require('path');




app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ 
	extended: true
}));


const port = 8080;

app.listen(port, () => {
  console.log(`Server running on port${port}`);
});
 
 
app.get("/index", function(req, res) {  
  res.sendfile(__dirname +"/index1.html");
});

app.get("/search", function(req, res) {  
  res.sendfile(__dirname +"/search.html");
});
 

app.post('/app.js', function(req,res){ 
	var question = req.body.question; 
	var topic =req.body.topic; 
	var tags = req.body.tags;
	 

	var data = { 
		"question": question, 
		"topic":topic, 
		"tags":tags, 
		
	};
	
 MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  delete req.body._id; // for safety reasons
  dbo.collection("query").insertOne(data, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});

	res.send('Data received:\n' + JSON.stringify(req.body));	
	 
});


var ans = "";

app.post('/db.js', function(req,res){ 
	var search = req.body.search; 

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  
  var dbo = db.db("mydb");

  dbo.collection("query").find( {$or:[{tags:{$regex: search, $options:"i"} }, {question:{$regex: search, $options:"i"} }]}  , { projection: {_id: 0, question: 1 } }).toArray(function(err, result) {
   if (err) throw err;
   
   for(var i = 0; i < result.length;i++){
        ans = ans + result[i].question+ os.EOL;
  }
   
    console.log(result);
    db.close();
  });
});

res.send('Data received:\n' + (ans));	
	 
});






//MongoClient.connect(url, function(err, db) {
 // if (err) throw err;
 // var dbo = db.db("mydb");
  //dbo.createCollection("query", function(err, res) {
  //  if (err) throw err;
  //  console.log("Collection created!");
  //  db.close();
  //});
  
 // dbo.collection("query").insertOne(data,function(err,res){
 //       if(err) throw err;
  //      console.log("inserted");
  //      db.close();
  
  
 // });
  
//});
