"use strict";
const LocalStrategy   = require('passport-local').Strategy,
      User            = require('../models/user');

module.exports = (passport=>{
         passport.serializeUser((user,done)=>{
        done(null,user.id);
     });
     
    passport.deserializeUser((id, done)=> {
        User.findById(id,(err, user)=> {
            done(err, user);
        });
});

    passport.use("local-signup",new LocalStrategy({
        usernameField : "email",
        passwordField : "password",
        passReqToCallback : true
    },
    (req,email,password,done)=>{

        process.nextTick(()=>{
    req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password must be at least 6 characters').isLength({min:6});
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  
  // handle the errors
      var errors = req.validationErrors();
      var error1=[];
      if(errors){
      errors.forEach((errs)=>{
         error1.push(errs.msg);
      });
      }
           User.findOne({"local.email":email},(err,existingUser)=>{
              if(err) return done(err);
              if(existingUser) return done(null,false,req.flash("error_msg","That email is already taken."));
              if(errors) return done(null,false,req.flash("error_msg",error1));
              else {

                    let newUser            = new User();

                    newUser.local.email        = email;
                    newUser.local.password     = newUser.generateHash(password);
                    newUser.local.username     = req.body.username;   
                    newUser.local.checkIns     =[];
                    newUser.save((err=> {
                        if (err)throw err;
                        return done(null, newUser);
                    }));
}
           }); 
        });
    }
    ));
    
   passport.use("local-login", new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true        
   },
   (req,email,password,done)=>{
            User.findOne({ 'local.email' :  email }, (err, user)=> {
                if (err) return done(err);

                if (!user) return done(null, false, req.flash('error', 'No user found.'));

                if (!user.validPassword(password)) return done(null, false, req.flash('error', 'Oops! Wrong email or password.'));

                else return done(null, user);
            });
   }
   )); 
    
});