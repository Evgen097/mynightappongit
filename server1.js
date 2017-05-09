const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();
var path = require('path');
var getIP = require('ipware')().get_ip;

var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var configDB = require('./config/db.js');
var morgan       = require('morgan');


var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser());

passport.use(new Strategy({
    consumerKey: "YMd1r1tUCUobQkT8SexL3bFpU",
    consumerSecret: "diRZYv71cNaK8Ne3JZIEmJBuIj0hW0EE4NgYS43e6xyMTZ7NwV",
    callbackURL: 'https://mytestangular-evgenkaban.c9users.io/login/twitter/return'
    
    //consumerKey: "yp1J03UfG5gcTxlrb0T3Knc8W",
    //consumerSecret: "5vTk0pkx8nb62KuAQhgwF7ja6jDf4FGO8MOZEj22bh3hplumB5",
    //callbackURL: 'https://myvotingap.herokuapp.com/login/twitter/return'
    
  },
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(require('express-session')({ secret: 'keyboardsecret2sdfscat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());


//app.use(express.static(__dirname + '/'));

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/view'));


app.use("/node_modules", express.static('node_modules'));
app.use("/app", express.static('app'));
app.use("/public/view/", express.static('public/view'));





//mongoose.connect(configDB.url); // connect to our database

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  require('./app/routes')(app, database, passport);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})

// npm run dev