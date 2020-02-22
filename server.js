//Requirements
const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

//view engine
app.set('view engine', 'ejs');
//Declaring body parser for reading data from html
app.use(bodyParser.urlencoded({extended: true}));

//Connecting to the mongodb
MongoClient.connect("mongodb+srv://alexUser:KnockKnock123@cluster0-knqsw.gcp.mongodb.net/test?retryWrites=true&w=majority", (err, database) => {
    if (err) console.log(err);
    //Connect to our cluster
    db = database.db('Cluster0');

    app.listen(8080, () => {
        console.log("Server running on localhost:8080");
    });
    
});

//GET requests
app.get('/', (req, res) => {
  res.render('pages/index.ejs');
});

//POST requests
app.post('/test', (req,res) =>{
    console.log(req.body);
});

//Server plz turn on
//const server = app.listen(8080, () => {
//  console.log(`Example app listening at http://${host}:${port}`);
//});