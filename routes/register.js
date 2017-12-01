

/*
This endpoint and the corresponding register.pug file were used to create user accounts for the demonstration,
and were not used in the demonstration
*/




var express = require('express');
var router = express.Router();
var {db} = require('../db/db');
var passport = require('passport');

var BoxSDK = require('box-node-sdk');
var sdk = require('../boxStuff/sdk');
var ENTERPRISE_ID = '31705695';
var adminAPIClient = sdk.getAppAuthClient('enterprise', ENTERPRISE_ID);

router.get('/', function(req, res, next) {
  res.render('register');
});

router.use('/registerUser', function checkIfUserNameTaken(req, res, next)
{
  var username = req.body.username;
  res.locals.username = username;
  var nameQuery = `select * from users where username = $1`;
  db.oneOrNone(nameQuery, [username])
  .then(function(data){
    if(data != null)
    {
      res.redirect('/');
    }
    else {
      next();
    }
  })
  .catch(function(error){
    return res.send(error);
  });
});

function signUpBoxUser(req, res, next){
  var requestParams = {
		body: {
			name: res.locals.username,
			is_platform_access_only: true
		}
	};

  adminAPIClient.post('/users', requestParams, adminAPIClient.defaultResponseHandler(function(err, data) {

		if (err) {
			console.log(err.message);
		}

		// If the user was created correctly, set up their logged-in session
		//req.session.email = req.body.email;
		//req.session.userID = data.id;
		//res.redirect('/files');
    console.log("user id = ", data.id);
    next();
	}));

}

router.use(signUpBoxUser);

router.post('/registerUser', function(req, res, next)
{
  var username = req.body.username;

  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var encryptedPassword = new Buffer(password).toString('base64');
  var insertQuery = `INSERT INTO users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4)`;
  db.none(insertQuery, [username, firstname, lastname, encryptedPassword])
  .then(function()
  {
    next();
  })
  .catch(function(error){
    return res.send(error);
  });
}, passport.authenticate('local',
{successRedirect: '/lobby', failureRedirect: '/'}));



module.exports = router;
