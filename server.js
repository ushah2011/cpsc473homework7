var express = require("express"),
    http = require("http"),
    // import the mongoose library
    mongoose = require("mongoose"),
    app = express(),
    bodyParser = require('body-parser');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));


// connect to the amazeriffic data store in mongo
mongoose.connect('mongodb://localhost/homework7');

// This is our mongoose model for trackdb
var TrackClicksSchema = mongoose.Schema({
    "title": String,
    "link": String,
    "clicks" : Number
});

var TrackClicksDB = mongoose.model("TrackClicksDB", TrackClicksSchema);

//http.createServer(app).listen(3000);
app.listen(3000, function(){
     console.log('HW7: Listeninng on 3000');
});

app.get("/links", function (req, res) {
    TrackClicksDB.find({}, function (err, TrackClicks) {
        if (err !== null) {
            console.log("Error : ", err);
        } else {
            console.log("Found database");
            res.json(TrackClicks);
        }
    });
});

app.post("/links", function (req, res) {
    console.log(req.body);
    var click = new TrackClicksDB({"title" : req.body.title, "link" : req.body.link, "clicks:":0});
    click.save(function (err, result) {
    if (err !== null) {
        // the element did not get saved!
        console.log(err);
        res.send("ERROR");
    } else {
        // our client expects *all* of the todo items to be returned, so we'll do
        // an additional request to maintain compatibility
        TrackClicksDB.find({}, function (err, result) {
        if (err !== null) {
            // the element did not get saved!
            res.send("ERROR");
        }
        res.json(result);
        });
    }
    });
});

app.get("/click/:title", function(req, res){
    var rTitle = req.params.title;
    TrackClicksDB.findOneAndUpdate({"title":rTitle}, {$inc:{"clicks":1}},function(err, clicks){

       if(err!== null){
         console.log("ERROR:", err);
         return;
       }else{
         console.log("Clicks:", clicks);
         res.redirect(clicks.link);
       }
     });
   });

