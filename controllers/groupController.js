const express =require('express');

var router =express.Router();
const path =require('path');
const objectId =require('mongodb').ObjectId;
const mongo = require('mongodb').MongoClient;
const mongoose =require('mongoose');
const ojUser = mongoose.model('ojUsername');
const User =mongoose.model('User');
const toastr = require('express-toastr');
var bcrypt = require('bcryptjs');
const passport =require('passport');
const {ensureAuthenticated} =require('../config/auth');
const url ='mongodb://localhost:27017';
const request = require('request');
const cheerio=require('cheerio');
var ojdetails=mongoose.model('ojdetails');
var usergroup=mongoose.model('userGroups');
var group=mongoose.model('group');
const puppeteer = require('puppeteer');
var contestscheduleSchema=mongoose.model('contestSchedule');
var moment = require('moment');

router.get('/',ensureAuthenticated,(req,res) => {
    usergroup.findOne({ username: req.user.username}, function (err, usr) {
        if(err) {
            throw err;
        }
        else if(!usr){
            res.render("group",{
                msg : "No group right now."
            });
        }
        else{
            if(usr.groups.length==0)
            {
                res.render("group",{
                    msg : "No group right now."
                });
            }
            else{
                console.log(usr.groups);
                res.render("group",{
                    arr : usr.groups
                });
            }
        }

    } );
});

router.post('/', (req,res) => {
    
    var uniqid = Date.now();
    var name=req.body.groupName;
    var grp=new group();
    grp.userid=uniqid;
    grp.name=name;
    var usrgrp=new usergroup();
    grp.save((err,doc) => {
        if(err) throw err;
        usergroup.findOne({username: req.user.username} , function(err,user) {
            if(err) throw err;
            if(!user)
            {
               
                usrgrp.username=req.user.username;
                var arr=[];
                arr.push([uniqid,name]);
                usrgrp.groups=arr;
                usrgrp.save((err,doc) => {
                    if(err) throw err;
                    res.redirect(('/profile/group/groupCreate/'+uniqid));
                })
            }
            else
            {
                //console.log(user);
                var arr=user.groups;
                arr.push([uniqid,name]);
                mongo.connect(url , (err,client) => {
                    var db= client.db('testdb');
                    if(err) throw err;
                    // user update
                    db.collection('usergroups').updateOne({"_id":objectId(user.id)}, {$set : {
                      groups : arr
                    }},(err,result)=>
                      { if(err) throw err;
                        res.redirect(('/profile/group/groupCreate/'+uniqid));
                  });
                  
            });
        }
        
        })
        
    })

    
   

});

router.get('/groupCreate/admin/users', function(req, res) {
    var query = req.query.search;

    User.find({'username' : new RegExp(query, 'i')}, function(err, users){
        if(err) throw err;
        //console.log(users);

    res.json({data:users});
});

});

router.get('/groupCreate/:id',ensureAuthenticated,(req,res) => {
    group.findOne({userid : req.params.id} , function(err, usr) {
        if(err) throw err;
        res.render("groupCreate", {
            groupid : usr.userid,
            name : usr.name,
            member : usr.user
        });
    })
   
});
router.post('/groupCreate/:id',(req,res) => {
    var arr=[];
    group.findOne({userid : req.params.id} , function(err, us) {
        if(err) throw err;
        //console.log(usr);
        //console.log(req.body.user);
    
    User.findOne({username : req.body.user}, function(err, users){
        if(err) throw err;
        //console.log(users);
        if(!users)
        {
            req.flash('error_msg','No User Found');
            res.redirect(('/profile/group/groupCreate/'+req.params.id));

        }
        else{
        arr=us.user;
        var ok=true;
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i]==users.username) ok=false;
        }
        if(ok==false)
        {
            req.flash('error_msg','User Already Exist');
            res.redirect(('/profile/group/groupCreate/'+req.params.id));
        }
        else{
        
            var ar=[];
            ar.push(users.username);
            ojUser.findOne({ username: users.username}, async function (err, usr) {
                if (err) { return done(err); }
                console.log(usr);
                  ojdetails.findOne({ username:('cf'+usr.cfUsername)}, async function (err, usr1) {
                    if(err) throw err;
                      ojdetails.findOne({ username:('codechef'+usr.codechefUsername)}, async function (err, usr2) {
                        if(err) throw err;
                    
                          ojdetails.findOne({ username:('uva'+usr.uvaUsername)}, async function (err, usr3) {
                            if(err) throw err;
                        
                                      ojdetails.findOne({ username:('hackerrank'+usr.hackerrankUsername)}, async function (err, usr4) {
                                        if(err) throw err;
                                      
                                      //  console.log(usr1);
                                       if(usr1){
                                         ar.push(usr1.solvedProblem);
                                         ar.push(usr1.highestRating);
                                         ar.push(usr1.rating);
                                       }
                                       else
                                       {
                                           ar.push(0); ar.push(0); ar.push(0);
                                       }
                                       if(usr2)
                                       {
                                        ar.push(usr2.solvedProblem);
                                        ar.push(usr2.highestRating);
                                        ar.push(usr2.rating);
                                      }
                                      else
                                      {
                                          ar.push(0); ar.push(0); ar.push(0);
                                      }
                                      if(usr4)
                                      {

                                       ar.push(usr4.rating);
                                     }
                                     else
                                     {
                                         ar.push(0);
                                     }
                                     if(usr3)
                                     {
                                      ar.push(usr3.solvedProblem);
                                 
                                    }
                                    else
                                    {
                                        ar.push(0);
                                    }
                                    arr.push(ar);
                                    console.log(ar);
        mongo.connect(url , (err,client) => {
        var db= client.db('testdb');
        if(err) throw err;
        // user update
        db.collection('groups').updateOne({"_id":objectId(us.id)}, {$set : {
            user : arr
        }},(err,result)=>
          { if(err) throw err;
            req.flash('success_msg','User Added');
      res.redirect(('/profile/group/groupCreate/'+req.params.id));
      });
      
});
                                
                                    
                                      })
                       
                          })
                        
                      })
            
            
                  })
            
            
              });

        
}
        }
}); 
});
});
router.post('/groupCreate/:id/delete',(req,res) => {
    group.findOne({userid : req.params.id}, (err,user) => {
    mongo.connect(url , (err,client) => {
        var db= client.db('testdb');
        if(err) throw err;
        // user update
        db.collection('groups').deleteOne({"_id":objectId(user.id)});
        usergroup.findOne({username : req.user.username}, (err, usr) =>{
        var arr=usr.groups;
        var temp=[];
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i][0]!=user.userid)
            {
                temp.push(arr[i]);
                
            }
        }
        db.collection('usergroups').updateOne({"_id":objectId(usr.id)}, {$set : {
            groups : temp
          }},(err,result)=>
            { if(err) throw err;
              res.redirect('/profile/group/');
        });
    });
    });
});
});

module.exports=router;