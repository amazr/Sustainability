//Requirements
const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

//view engine
app.set('view engine', 'ejs');
//Declaring body parser for reading data from html
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('resources'))

//Connecting to the mongodb
MongoClient.connect("mongodb+srv://alexUser:KnockKnock123@cluster0-knqsw.gcp.mongodb.net/test?retryWrites=true&w=majority", (err, database) => {
    if (err) return console.log("CONNECTION" + err);
    //Connect to our cluster
    db = database.db('Cluster0');

    app.listen(8080, () => {
        console.log("Server running on localhost:8080");
    });

});

//GET requests  TODO 404 page
app.get('/', (req, res) => {
    res.render('pages/index.ejs');
});
app.get('/search', (req, res) => {
    res.render('pages/search.ejs');
});
app.get('/input', (req, res) => {
    res.render('pages/input.ejs');
});
app.get('/footprint', (req, res) => {
    res.render('pages/footprint.ejs');
});
app.get('/register', (req, res) => {
    res.render('pages/register.ejs');
});
app.get('/about', (req, res) => {
    res.render('pages/aboutus.ejs');
});


//POST requests
app.post('/metrics', (req,res) => {
    console.log(req.body);
    let sname = req.body.name;
    delete req.body.name;
    db.collection('stores').updateOne(
        {name:sname},
        {$push: {metrics:req.body}}
    )
});

app.post('/account', (req,res) => {
    console.log(req.body);
    req.body.metrics = [{}];

    db.collection('stores').insertOne(req.body, (err, result) => {
        if (err) return console.log(err);
    });

    res.redirect('/');
});

/*
 {
     name:"place",
     state:"place",
     metrics: [{
         trash:3.2,
         recycle:3.2,
         compost:3.2,
         milk:
         commute:
         gas:
         electric:
         water:
         coffee:
         date:
     }]
 }
*/