var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var request = require('request');
var bcrypt = require('bcrypt')
var flash = require('connect-flash');
var unirest = require('unirest');
var multer = require('multer');
var cloudinary = require('cloudinary');
var geocoder = require('geocoder');
var db = require('./models');

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(__dirname + '/public'));

app.use(multer({dest: __dirname+'/uploads'}))

app.set('view engine', 'ejs');

app.use(session({
  secret: 'secret session',
  resave: false,
  saveUninitialized: true
}));



app.use(flash());

app.use(function(req, res, next){


  // THIS IS TEMPORARY GET RID OF IT LATER //
  // MAKES YOU LOGGED IN WHEN THE APP LOADS
  // req.session.user = {
  //   id: 3,
  //   email: 'alexander@alexander.com',
  //   name: 'alex'
  // };
  //////////////////////////////////////////

  req.getUser = function(){
    return req.session.user || false;
  }
  next();
});

//Flash Alerts
app.get('*',function(req, res, next){
  var alerts = req.flash();
  var user = req.getUser();
  res.locals.alerts = alerts;
  res.locals.user = user;

  if(!user){
    switch(req.url){
      case '/auth/login':
      case '/auth/signup':
      case '/':
      //do nothing (code usually goes in this area)
      break;
      default:
      req.flash('danger','Please log in')

    }
  }
  next();
});

//Home Directory
app.get('/',function(req, res){
  res.render('index')
});

//Login Route
app.get('/auth/login',function(req, res){
  res.render('login')
});

//Login
app.post('/auth/login',function(req, res){
  db.user.find({where: {email: req.body.email}}).then(function(userObj){
    if(userObj){
      bcrypt.compare(req.body.password, userObj.password, function(err, match){
        if(match === true){
          req.session.user = {
            id: userObj.id,
            email: userObj.email,
            name: userObj.name
          };
          res.redirect('/home');
        } else {
          req.flash('danger','invalid password');
          res.redirect('/auth/login');
        }
      })
    } else {
      req.flash('info', 'invalid email');
      res.redirect('/auth/login');
    }
  })
});

//Signup Route
app.get('/auth/signup',function(req, res){
  res.render('signup')
});

//Signup
app.post('/auth/signup',function(req, res){
  db.user.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults: {
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
      city: req.body.city
    }
  }).spread(function(user, created){
    res.redirect('/home')
  }).catch(function(error){
    if(error && error.errors && Array.isArray(error.errors)){
      error.errors.forEach(function(errorItem){
        req.flash('danger', errorItem.message);
      });
    } else {
      req.flash('danger', 'unknown error');
    }
    res.redirect("/auth/signup")
  });
});

//Home Page
app.get('/home',function(req, res){
  res.render('home')
});

//Profile
app.get('/profile',function(req, res){
      var user = req.getUser()

  db.user.find({where:{ id:user.id}}).then(function(userData){
    var imgId= "user_" + user.id
      var imgThumb = cloudinary.url(imgId, {
      width:90,
      height:90,
      crop:'fill',
      radius: 'max'

    })
    res.render('profile',{ mypicture:imgThumb})
  })

});

//Lat Long Search
app.get('/search',function(req, res){
  if(req.query.lat && req.query.lng){
    lookUpTrails(req.query.lat,req.query.lng);
  }else{
    geocoder.geocode(req.query.city, function ( err, data ) {
      if(data && data.results && Array.isArray(data.results) && data.results.length > 0){
        var citylat = data.results[0].geometry.location.lat
        var citylng = data.results[0].geometry.location.lng
        lookUpTrails(citylat,citylng);
      }else{
        req.flash('error',"invalid city");
        res.redirect('/home');
      }
    });
  }


  function lookUpTrails(citylat,citylng){
    geocoder.reverseGeocode( citylat, citylng, function ( err, data ) {

      var isCascadia = (data.results[0].formatted_address.match(/, WA|, OR|, ID|, BC/) || []).length > 0;
      if(isCascadia){
        unirest.get("https://trailapi-trailapi.p.mashape.com/?lat=" + citylat +"&lon="+ citylng + "&q[activities_activity_type_name_eq]=hiking&radius=30")

        .header("X-Mashape-Key", process.env.trailsapi2)
        .end(function (result) {
      // console.log(result.body.places)
      var place = result.body.places
      // res.send(place);
      console.log('-------- API RESULT',result);
      res.render('search', {place: place});
      })
      } else {
        res.send(req.query.city + " is not a Cascadian city")}
      });
  }

});

//Trailpage
app.get('/trails', function(req, res){
  var name = req.query.name;
  var city = req.query.city;
  var trailId = req.query.uniqueid;

  unirest.get("https://trailapi-trailapi.p.mashape.com/?q[activities_activity_name_cont]="+ name +"&q[activities_activity_type_name_eq]=hiking&q[city_cont]="+city)
        .header("X-Mashape-Key", process.env.trailsapi2)
        .end(function (result) {
          console.log(result.body)
          var place = result.body.places.filter(function(element) {
            return (element.unique_id == trailId)
            //.activities[0].name == name
          })[0];
          // res.send(place);
        res.render('trailpage',{place: place});
    })
})

//Comments
// app.post(function(req, res){

// })

//Favorite Page
app.get('/favorites', function(req, res){
  var user = req.getUser()
  db.favtrails.findAll({where: {userId: user.id}}).then(function(data){
    res.render('favorites', {favtrails: data})
  })
})

//Favorites Saves
app.post('/favoritesav',function(req, res){
  var user = req.getUser()
  // res.send(req.body);
  db.favtrails.findOrCreate({ where: {trailId: req.body.unique, userId:user.id, city:req.body.city, name:req.body.name}}).spread(function(data, created){
    res.redirect('/favorites');
  })
})

//Profile Pic Upload
app.post('/foto',function(req, res){
  var myImgPath = req.files.picture.path;

  var user = req.getUser()

  cloudinary.uploader.upload(myImgPath, function(result){
    res.send(result);
  },{'public_id':'user_' + user.id})
})

//Show Pic
app.get('/show',function(req, res){
    var user = req.getUser()

  db.user.find({where:{ id:user.id}}).then(function(userData){
    var imgId= "user_" + user.id
      var imgThumb = cloudinary.url(imgId, {
      width:90,
      height:90,
      crop:'fill',
      radius: 'max'

    })
    res.render('profile',{ mypicture:imgThumb})
  })

})

//Log Out
app.get('/auth/logout',function(req,res){
  delete req.session.user;
  req.flash('success','You are now logged out');
  res.redirect('/')
})

app.listen(process.env.PORT || 3000);
