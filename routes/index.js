/*
This endpoint and the corresponding index.pug file were used to create user accounts for the demonstration,
and were not used in the demonstration
*/




var express = require('express');
var router = express.Router();
var {db} = require('../db/db');
var passport = require('passport');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});

router.post('/goToRegister', function(req, res, next){
  res.redirect('/register');
})

router.post('/goToLogin', function(req, res, next){
  res.redirect('/login');
})




module.exports = router;
