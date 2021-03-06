var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var {db} = require('./db');

passport.serializeUser(function(username, done){
  done(null, username);
});

passport.deserializeUser(function(username, done){
  done(null, username);
});

function initializePassport()
{
  console.log("PASSPORT SETUP");
    passport.use(new localStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
        console.log("passport function");
        var encryptedPassword = new Buffer(password).toString('base64');
        var query = `select * from users where username = $1 AND password = $2`;
        db.any(query, [username, encryptedPassword])
          .then(function(data){
        if(data.length == 0)
        {
          return done(null, false);
        }
        else
        {
          return done(null, username);
        }
      })
      .catch(function(error){
        console.log("ERROR: ", error);
        return done(error, false);
      });

    }))


}



module.exports = {initializePassport};
