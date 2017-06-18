"use strict";
const express = require("express");
const passport = require("passport");
const User = require('../models/user');
const router = express.Router();

router.get("/",(req,res)=>{ 
   res.render("index",{title:"Home",csrfToken: req.csrfToken()}); 
});

router.get("/register",(req,res)=>{
    if (req.user){
        res.redirect("/");
    }
    else {
   res.render("register",{title:"Register",csrfToken: req.csrfToken()}); 
    }
});

router.post('/register', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (! user) {
      return res.send(req.flash());
    } else {
        return res.redirect("/");
    }
  })(req, res, next);
});

router.post('/login', 
    	passport.authenticate('local-login', 
    	{        
    	   failureRedirect : '/',
    		failureFlash: true    
    	}), function (req, res) { 
let total=[];
  User.find( { "local.checkIns": {$in: [req.params.id]}},(err,users)=>{
               users.map(checks=>{
                  total.push(checks.local.checkIns);
               });    	    
    	    res.send([req.user,total]);
  });
    	}
    );


router.get("/logout",(req,res)=>{
   req.logout();
   req.flash("success_msg","You are logged out ");
   res.redirect("/");
});

router.get("/check_in/:id",(req,res)=>{
     let total=[];
     User.update({_id: req.user.id,}, 
              {$addToSet: {'local.checkIns': req.params.id}},(err)=>{
                if(err)console.log(err);
       }); 
  User.find( { "local.checkIns": {$in: [req.params.id]}},(err,users)=>{
               users.map(checks=>{
                  total.push(checks.local.checkIns);
               });
                  res.json([total.length,req.user.local.checkIns]);   
                 } );
      

});

router.get("/remove_check_in/:id",(req,res)=>{
     let total=[];
     User.update({_id: req.user.id,}, 
              {$pull: {'local.checkIns': req.params.id}},(err)=>{
                if(err)console.log(err);
       }); 
  User.find( { "local.checkIns": {$in: [req.params.id]}},(err,users)=>{
               users.map(checks=>{
                  total.push(checks.local.checkIns);
               });
                  res.json([total.length,req.user.local.checkIns]);   
                 } );
      

});

router.get("/search",(req,res)=>{
    if(req.user)
   res.send(req.user.local.checkIns);
   else 
   res.send();
});

module.exports = router;