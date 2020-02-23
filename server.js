//Requirements
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser= require('body-parser');
const bcrypt = require("bcrypt");
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const plotly = require('plotly')("alma9011", "3gQfXmOXNjYWJV5CzIWm");


const app = express();

//view engine
app.set('view engine', 'ejs');
//Declaring body parser for reading data from html
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('resources'))
app.use(session({
    store:  new MongoStore({
        uri:"mongodb+srv://alexUser:KnockKnock123@cluster0-knqsw.gcp.mongodb.net/test?retryWrites=true&w=majority",
        collection:"mySessions"
    }),
    secret:'xBSBCljxbJbcjdhblJHXwi123',
    resave:true,
    saveUnitialized:true,
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
    let results = [];
    res.render('pages/search.ejs', {results:results});
});
app.get('/account', (req, res) => {
    if (req.session.user) {
        res.render('pages/input.ejs');
    } 
    else {
        res.render('pages/account.ejs', {error:""});
    }
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
app.get('/:name', (req,res) => {
    //req.params.name
    db.collection('stores').findOne({storeID:parseName(req.params.name)}, function(err, result) {
        if (err || result === null) console.log("303");
        else {
            res.render('pages/dynamicStore.ejs',{
                username: "alma9011",
                apikey: "3gQfXmOXNjYWJV5CzIWm",
                storedata: result.metrics,
                storename: result.name,
                storestate: result.state
            });
        }
    });
});

//POST requests
//Adding metrics to a unique store
app.post('/metrics', (req,res) => {
    //MUST GET STORE NAME FROM SESSION
    let sname = req.body.name;
    delete req.body.name;
    req.body.date = new Date();
    db.collection('stores').updateOne(
        {name:sname},
        {$push: {metrics:req.body}}
    )
    res.redirect('/');
});

//USER ATTEMPTING TO LOGIN
app.post('/login', async (req,res) => {

    db.collection('stores').findOne({storeID:parseName(req.body.name)}, function(err, result) {
        console.log(result);
        if (err || result === null) res.render('pages/account.ejs', {error:"invusr"});
        else {
            let user = result;
            let isPasswordCorrect = false;
            password = req.body.password;
            bcrypt.compare(password, user.password, (err, result) => {
                if (err || result === null) res.render('pages/account.ejs', {error:"invpwd"});
                if (result) isPasswordCorrect = true;
                if (isPasswordCorrect) {
                //user logged in
                    req.session.user = {
                    name: user.name,
                    };
                    console.log("user logged in");
                    res.redirect('/account');
                }    
                else {
                    //user failed to login
                    res.render('pages/account.ejs', {error:"invpwd"});
                }
            });
        }
    });
})

//USER LOGGING OUT
app.post('/logout', (req,res) => {
    if(req.session.user) {
        delete req.session.user;
        console.log("user logged out");
        res.redirect('/account');
    } else {
        res.redirect('/');
    }   
})

//CREATE NEW ACCOUNT
app.post('/register', (req,res) => {

    //lets do some password stuff
    let plainPassword = req.body.password;
    let repeat = req.body.rpassword;
    delete req.body.rpassword;
    let storeID = parseName(req.body.name);
    req.body.storeID = storeID
    
    db.collection('stores').findOne( {storeID:req.body.storeID}, (err, example) => {
        if (example) {
            return console.log("User already exists");
        } else {
            if (plainPassword === repeat) { 
                //Passwords match
                req.body.metrics = [{}];
                bcrypt.hash(plainPassword, 10, (err, hash) => {
                    req.body.password = hash;
                    db.collection('stores').insertOne(req.body, (err, result) => {
                        if (err) return console.log(err);
                        else console.log("User Created");
                    });
                });
            }
            else {  
                //Passwords do NOT match
                console.log("Passwords Don't match");
            }
        }
    });

    //WHERE TO GO AFTER REGISTERING FOR AN ACCOUNT
    res.redirect('/');
})

//SEARCHING
app.post('/search', (req,res) => {
    storeID = parseName(req.body.name)
    console.log(new RegExp(req.body.name));
    db.collection('stores').find( {storeID: new RegExp(storeID)}).toArray(function(err, results) {
        res.render('pages/search.ejs',{results:results});
    });
})

//remove whitespace and lowercase all letters
function parseName(name) {
    name = name.replace(/ /g, "");
    name = name.toLowerCase();
    return name;
}


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