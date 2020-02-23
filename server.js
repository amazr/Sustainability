//Requirements
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser= require('body-parser');
const bcrypt = require("bcrypt");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

//view engine
app.set('view engine', 'ejs');
//Declaring body parser for reading data from html
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('resources'))
app.use(session({
    store:  new MongoStore({
        url:"mongodb+srv://alexUser:KnockKnock123@cluster0-knqsw.gcp.mongodb.net/test?retryWrites=true&w=majority"
    }),
    secret:'xBSBCljxbJbcjdhblJHXwi123',
    resave:false,
    saveUnitialized:false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // two weeks
    }
}));

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
//Adding metrics to a unique store
app.post('/metrics', (req,res) => {
    //MUST GET STORE NAME FROM SESSION
    let sname = req.body.name;
    delete req.body.name;
    db.collection('stores').updateOne(
        {name:sname},
        {$push: {metrics:req.body}}
    )
});

app.post('/login', async (req,res) => {
    let user;
    try {
        user = await db.collection('stores').findOne({
            name:req.body.name
        });
    }catch {
        console.log("user doesn't exist");
    }

    let isPasswordCorrect = false;
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) isPasswordCorrect = true;
    });
    if (isPasswordCorrect) {
        //user logged in
    }    
    else {
        //user failed to login
    }
})

//CREATE NEW ACCOUNT
app.post('/account', (req,res) => {
    //lets do some password stuff
    let plainPassword = req.body.password;
    let repeat = req.body.rpassword;

    if (plainPassword === repeat) { 
        //Passwords match
        req.body.metrics = [{}];
        bcrypt.hash(plainPassword, 10, (err, hash) => {
            req.body.password = hash;
        });
        db.collection('stores').insertOne(req.body, (err, result) => {
            if (err) return console.log(err);
        });
    }
    else {  
        //Passwords do NOT match
    }

    req.body.metrics = [{}];
    db.collection('stores').insertOne(req.body, (err, result) => {
        if (err) return console.log(err);
    });

    //WHERE TO GO AFTER REGISTERING FOR AN ACCOUNT
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