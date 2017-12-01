var express = require('express');
var router = express.Router();
var {db} = require('../db/db');
var passport = require('passport');





router.get('/', function(req, res) {
  res.render('login');
});

router.post('/loginUser', passport.authenticate('local',
  {successRedirect: '/lobby', failureRedirect:'/'})
);




module.exports = router;
