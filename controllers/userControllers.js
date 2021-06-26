const express =require('express');

var router =express.Router();
const mongoose =require('mongoose');
var usergroup=mongoose.model('userGroups');
const mongo = require('mongodb').MongoClient;
const User = mongoose.model('User');
const toastr = require('express-toastr');
var bcrypt = require('bcryptjs');
const passport =require('passport');
const ojUser = mongoose.model('ojUsername');
const {ensureAuthenticated} =require('../config/auth');
const request = require('request');
const cheerio=require('cheerio');
const puppeteer = require('puppeteer');
var ojdetails=mongoose.model('ojdetails');
const url ='mongodb://localhost:27017';
const objectId =require('mongodb').ObjectId;
var contestscheduleSchema=mongoose.model('contestSchedule');
var moment = require('moment');
const { route } = require('./groupController');


router.get('/',(req,res) => {
  res.render("home");
});

router.post('/', (req,res) => {
    User.findOne({username : req.body.name} ,(err,user) => {
        if(err) throw err;
        if(!user)
        {
            req.flash('error_msg', 'No User With this Name');
            res.redirect('/');
        }
        else
        {
            res.redirect('/profile/'+user.username+'/view');
        }
    })
})

router.get('/register',(req,res) => {
    res.render("register");
  });
  
router.post('/register',(req,res) => {
    insertRecord(req,res);
  });

  router.get('/login',(req,res) => {
    res.render("login");
  });

router.get('/contestSchedule' , (req,res)=> {   
    var d=new Date();
    var date=d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();
    contestscheduleSchema.findOne({ date:date}, function (err, usr2) {
        if(err) 
        {
            throw err;
        }
        if(!usr2) 
        {
            req.flash('error','Something Problem here. Reload the page afte 40 sec');
            res.render('contestSchedule', {
                moment : moment
            });
            setTimeout(loadcontest,10000);
            //loadcon();

        }
        else
        {
            res.render('contestSchedule', {
                date : usr2.date,
                len: usr2.len,
                contest:usr2.contest,
                moment :moment
            });
        }
    })    
});

router.post('/login',(req,res,next) => {
    passport.authenticate('local', function(err, user, info) {

        if (err) { return next(err); }
        if (!user) { 
            return res.render('login', {
            message : 'Invalid Username or Incorrect Password'
        }); }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          console.log(req.app.locals.authenticated);
          req.flash('Uusername',user.username);
          req.flash('success_msg','you are successfully logged in!');
          res.redirect('/profile');
        });
      })(req, res, next);
  });

function insertRecord(req,res){
    var user =new User();
    user.email=req.body.email;
    user.fullname=req.body.fullname;
    user.username=req.body.username;
    user.password=req.body.password;
    console.log(req.body);
    if(user.password!=req.body.conpassword)
    {
        var passwordError= 'Password not matched';
        res.render("register", {
            fullname : req.body.fullname,
            username : req.body.username,
            email : req.body.email,
            passwordError
        });
    }
    else if(req.body.password.length<1)
    {
        var passwordError='Password must be at least 8 characters';
        console.log('ok');
        res.render("register", {
            fullname : req.body.fullname,
            username : req.body.username,
            email : req.body.email,
            passwordError
        });
    }
    else{
    
        //if a user was found, that means the user's email matches the entered email
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) throw err;
                user.password=hash;
                user.save((err,doc) => {
                    if(!err){
                        var ojuser=new ojUser();
                        ojuser.username=user.username;
                        ojuser.cfUsername='';
                        ojuser.codechefUsername='';
                        ojuser.uvaUsername='';
                        ojuser.hackerrnakUsername='';
                        
                        ojuser.save((err,doc)=> {
                            if(err) throw err;
                        });
                        var usergrp=new usergroup();
                        usergrp.username=user.username;
                        usergrp.save((err,doc)=> {
                            if(err) throw err;
                        });
                        req.flash('success_msg', 'Resgistration completed. Please login.')
                                res.redirect('/login');
                    }
                    else 
                    {
                        if(err.name == 'ValidationError')
                        {
                            handleValidationError(err,req.body);
                            if(req.body.emailError!='undefined' && req.body.userNameError!='undefined'){
                            res.render("register", {
                                fullname : req.body.fullname,
                                username : req.body.username,
                                email : req.body.email,
                                emailError : req.body.emailError,
                                userNameError:req.body.userNameError
                            });
                        }
                        else    if(req.body.emailError!='undefined'){
                            res.render("register", {
                                fullname : req.body.fullname,
                                username : req.body.username,
                                email : req.body.email,
                                emailError : req.body.emailError
                            });
                        }
                        else    if(req.body.userNameError!='undefined'){
                            res.render("register", {
                                fullname : req.body.fullname,
                                username : req.body.username,
                                email : req.body.email,
                                userNameError:req.body.userNameError
                            });
                        }
                        }
                        console.log("error in insertion: "+ err);
                    }
                });
            });
        });
            
        }
   
}

function handleValidationError(err,body)
{
   // console.log('ok');
    for(var field in err.errors)
    {
        switch(err.errors[field].path)
        {
            case 'email' :
                body['emailError'] = err.errors[field].message;
                break;
            case 'username' :
                body['userNameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }

}
function compare(a,b)
{
    if(a[0]==b[0]){
    var st1=a[1].toString();
    var st2=b[1].toString();
    st1=st1.substring(0,5);
    if(st1.length>=5){
    st2=st2.substring(0,5);
    var z1=parseInt(st1.substring(3,5),10);
    var z2=parseInt(st2.substring(3,5),10);
    if(z1<z2) return -1;
    if(z1>z2) return 1;
    z1=parseInt(st1.substring(0,2),10);
    z2=parseInt(st2.substring(0,2),10);
    if(z1<=z2) return -1;
    return 1;
    }
}
if(a[0]=='past') return -1;
if(b[0]=='past') return 1;
if(a[0]=='running') return -1;
if(b[0]=='running') return 1;
return 0;

}
function check(time)
{
    var today=new Date();
    var st=time.toString().substring(0,5);
    var dt1=parseInt(st.substring(0,2),10);
    var mn1=parseInt(st.substring(3,5),10);
    var dt2=parseInt(today.getDate().toString(),10);
    var mn2=parseInt(today.getMonth().toString(),10);
    if(mn1>mn2) return 0;
    if(mn1==mn2 && dt1>dt2) return 0;
    return 1;


}
async function loadcontest()
{
    var d=new Date();
    //if date already in database
    var date=d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();
    //console.log(date);
    var contestschedule =new contestscheduleSchema();
    contestschedule.date=date;
    var clisturl='https://clist.by/';
    puppeteer
    .launch(
     { slowMo: 250}
    )
    .then(browser => browser.newPage())
    .then(page => {
      page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
       });
       page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')
      return page.goto(clisturl , {waitUntil: 'networkidle2',timeout: 0} ).then(function() {
        return page.content();
      });
    })
    .then(html => {
      const $ = cheerio.load(html);
      var len=($('#contests > div').length);
      var arr=[];
      for(var i=2;i<=len;i++)
      {
        var cls=$('#contests > div:nth-child('+i+')').attr('class');
        //#contests > div:nth-child(8) > div.col-md-7.col-sm-8.event > span > a:nth-child(2)
        var site=$('#contests > div:nth-child('+i+') > div.col-md-7.col-sm-8.event > span > a').attr('href');
        var time= $('#contests > div:nth-child('+i+') > div.col-md-5.col-sm-4 > div.col-md-5.col-sm-12.start-time > a').text().trim();
        var duration=$('#contests > div:nth-child('+i+') > div.col-md-5.col-sm-4 > div.col-md-3.col-sm-6.duration').text();
        var contestName=$('#contests > div:nth-child('+i+') > div.col-md-7.col-sm-8.event > span > a').text();
        var siteName=$('#contests > div:nth-child('+i+') > div.col-md-7.col-sm-8.event > div > a > small').text();
        if(cls.includes('past'))
        {
            if(cls.includes('subcontest'))
            {
                site=$('#contests > div:nth-child('+i+') > div.col-md-7.col-sm-8.event > span > a:nth-child(2)').attr('href');
            }
            arr.push(['past',time,duration,site,siteName,contestName]);
        }
        else if(cls.includes('running') && check(time))
        {
            if(cls.includes('subcontest'))
            {
                site=$('#contests > div:nth-child('+i+') > div.col-md-7.col-sm-8.event > span > a:nth-child(2)').attr('href');
            }
            arr.push(['running',time,duration,site,siteName,contestName]);
        }
        else
        {
            if(cls.includes('subcontest'))
            {
                site=$('#contests > div:nth-child('+i+') > div.col-md-7.col-sm-8.event > span > a:nth-child(2)').attr('href');
            }
            arr.push(['coming',time,duration,site,siteName,contestName]);   
        }
        
      }
      arr.sort(compare);
     // console.log(arr);
      contestschedule.date=date;
      contestschedule.len=len-1;
      contestschedule.contest=arr;
      contestscheduleSchema.findOne({ date:date}, function (err, usr2) {
        if(err) throw err;
        //console.log(usr2.len);
        if(!usr2) 
        {
            contestschedule.save((err,doc) => {
                if(err) throw err;
              })
        }
        else
        {
       
          mongo.connect(url , (err,client) => {
            var db= client.db('testdb');
            db.collection('contestschedules').updateOne({"_id": objectId(usr2.id)},{$set : {
              len :contestschedule.len,
              contest : contestschedule.contest
            }},(err,result)=>
            { if(err) throw err;
        });
       });
        
        }
   
     })
      //console.log(arr);
      //#contests > div:nth-child(4) > div.col-md-7.col-sm-8.event > span > a
})
.catch(console.error);
        console.log('done');
     

}

router.get('/admin/users', function(req, res) {
    var query = req.query.search;

    User.find({'username' : new RegExp(query, 'i')}, function(err, users){
        if(err) throw err;
        //console.log(users);

    res.json({data:users});
});

});

router.get('/about', (req,res) => {

    res.render('about');
})

module.exports=router;