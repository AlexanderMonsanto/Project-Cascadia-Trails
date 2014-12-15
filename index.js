var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = reqruire('body-parser');
var request = require('request');
var flash = require('connect-flash');
var db = require('./models');

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(session({
  secret: 'secret session',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(function(req, res, next){
  getUser(function(){
    return req.session.user || false;
  })
  next();
});

app.get('*',function(req, res, next){
  var alerts = req.flash();
  res.local.alerts = alerts;
  next();
});

app.get('/',function(req, res){
  res.render('/index')
});
