var express = require('express');
var router = express.Router();
var {db} = require('../db/db');
var BoxSDK = require('box-node-sdk');
var dotenv = require('dotenv');
var multipart = require('express-formidable');
var fs = require('fs');
var util = require('util');
var bodyParser = require('body-parser');
var path = require('path');
var fileUpload = require('express-fileupload');

var ENTERPRISE_ID = [ENTERPRISEID];
var sdk = require('../boxStuff/sdk');
var adminAPIClient = sdk.getAppAuthClient('enterprise', ENTERPRISE_ID);


function loggedIn(req, res, next) {
    if (req.user) {
        next();
        console.log(req.user, "logged in");
    } else {
        console.log("not logged in");
        res.render('error', {message:'you must be logged in to view lobby'});
    }
}

router.use(loggedIn);

router.use(bodyParser.urlencoded({
	extended: false
}));

function getBoxUserID(req, res, next){
  var userName = req.user;

  var requestParams = {
		qs: {
			filter_term: userName
		}
	};

  adminAPIClient.get('/users', requestParams, adminAPIClient.defaultResponseHandler(function(err, data) {

		if (err) {
      console.log(err.message);
		}

		var user = data.entries.find(match => match.name === userName);
		if (!user) {
      console.log("error: User not found");
		}
    console.log(user.id);
    res.locals.userID = user.id;
    next();
	}));


}

router.use(getBoxUserID);

function createUserClient(req, res, next){
  console.log("creating user client with id: ", res.locals.userID);
  res.locals.client = sdk.getAppAuthClient('user', res.locals.userID);
  next();
}

router.use(createUserClient);

function getFirstAndLastName(req, res, next){
  var userQuery = `select * from users where username = $1`;
  db.oneOrNone(userQuery, [req.session.passport.user])
    .then(function(data){
      if (data == null || data.length == 0){
        return res.redirect('/');
      } else {
        res.locals.firstname = data.firstname;
        res.locals.lastname = data.lastname;
        next();
      }
    })
    .catch(function(error){
      console.log("ERROR: ", error);
      return res.send(error);
    });
}

router.use(getFirstAndLastName);

function getFileName(req, res, next){
  var d = new Date();
  res.locals.filename = res.locals.lastname + "." + res.locals.firstname + "." + d;
  next();
}

router.use(getFileName);



router.use(fileUpload());

router.get('/', function(req, res, next) {
  res.render('lobby', {
                        user:req.user,
                        message:'Upload your application'

                      });
});

router.post('/upload', function(req, res, next) {
  console.log("checkpoint: upload function ");
  let file = req.files.file;

  //I want to rename the file but preserve the original file extension
  var fileName = res.locals.filename + path.extname(req.files.file.name);
  console.log(fileName);
  res.locals.client.files.uploadFile('0', fileName, req.files.file.data, function(err, data) {
    if (err){
      console.log(err);
    }
    res.render('lobby', {
      message:'Thank you for uploading'
    });
	});
});





module.exports = router;
