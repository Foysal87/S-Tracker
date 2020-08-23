const localStrategy = require('passport-local').Strategy;
const mongoose =require('mongoose');
const bcrypt= require('bcryptjs');
var passport =require('passport');

const User = mongoose.model('User');
module.exports = function(passport)
{
    passport.use(new localStrategy(
        function(username, password, done) {
          User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password,user.password, (err, isMatch) =>
            {
                if(err) throw err;
                if(isMatch)
                {
                    return done(null,user);
                }
                else{
                    return done(null,false,{message : 'password incorrect'});
                }
            });
        });
    }
        
      ));
    passport.serializeUser((user, done) =>{
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}
