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
var usergroup=mongoose.model('userGroups');
var group=mongoose.model('group');
const cheerio=require('cheerio');
var ojdetails=mongoose.model('ojdetails');
const puppeteer = require('puppeteer');
var contestscheduleSchema=mongoose.model('contestSchedule');
var moment = require('moment');




router.get('/',ensureAuthenticated,(req,res) => {
  scrap1(req);
    ojUser.findOne({ username: req.user.username}, function (err, usr) {
    if (err) { return done(err); }
      ojdetails.findOne({ username:('cf'+usr.cfUsername)}, function (err, usr1) {
        if(err) throw err;
        if(!usr1) 
        {
          usr1='';
        }
          ojdetails.findOne({ username:('codechef'+usr.codechefUsername)}, function (err, usr2) {
            if(err) throw err;
            if(!usr2) 
            {
              usr2='';
            }
              ojdetails.findOne({ username:('uva'+usr.uvaUsername)}, function (err, usr3) {
                if(err) throw err;
                if(!usr3) 
                {
                  usr3='';
                }
                          ojdetails.findOne({ username:('hackerrank'+usr.hackerrankUsername)}, function (err, usr4) {
                            if(err) throw err;
                            if(!usr4) 
                            {
                              usr4='';
                            }
                           // console.log(usr1);
                            res.render('profile' ,{
                              username : req.user.username,
                              fullname : req.user.fullname,
                              email : req.user.email,
                              cfUser:usr1,
                              codechefUser:usr2,
                              uvaUser:usr3,
                              hackerrankUser: usr4
                            });

                        
                          })
           
              })
            
          })


      })


  });
   
  });

router.get('/:id/view',(req,res) => {
  User.findOne({username: req.params.id}, (err,us) => {
    if(err) throw err;
    ojUser.findOne({ username: req.params.id}, function (err, usr) {
    if (err) { return done(err); }
    if(!usr)
    {
      req.flash('error_msg', 'No User With this Name');
      res.redirect('/');
    }
    else{
      ojdetails.findOne({ username:('cf'+usr.cfUsername)}, function (err, usr1) {
        if(err) throw err;
        if(!usr1) 
        {
          usr1='';
        }
          ojdetails.findOne({ username:('codechef'+usr.codechefUsername)}, function (err, usr2) {
            if(err) throw err;
            if(!usr2) 
            {
              usr2='';
            }
              ojdetails.findOne({ username:('uva'+usr.uvaUsername)}, function (err, usr3) {
                if(err) throw err;
                if(!usr3) 
                {
                  usr3='';
                }
                          ojdetails.findOne({ username:('hackerrank'+usr.hackerrankUsername)}, function (err, usr4) {
                            if(err) throw err;
                            if(!usr4) 
                            {
                              usr4='';
                            }
                           // console.log(usr1);
                            res.render('userProfile' ,{
                              username : us.username,
                              fullname : us.fullname,
                              email : us.email,
                              cfUser:usr1,
                              codechefUser:usr2,
                              uvaUser:usr3,
                              hackerrankUser: usr4
                            });

                        
                          })
           
              })
            
          })


      })

    }
  });
});
   
  });

router.get('/contestScheduleUser', ensureAuthenticated, (req,res) => {

  var d=new Date();
  var date=d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();
  contestscheduleSchema.findOne({ date:date}, function (err, usr2) {
      if(err) throw err;
      if(!usr2) 
      {
             
          req.flash('error','Something Problem here. Reload the page afte 40 sec');
          res.render('contestScheduleUser', {
              moment : moment
          });
          loadcon();

      }
      else
      {
          res.render('contestScheduleUser', {
              date : usr2.date,
              len: usr2.len,
              contest:usr2.contest,
              moment :moment
          });
      }
  })


})


router.get('/logout',ensureAuthenticated, (req,res) => {
    req.logOut();
    //req.session.destroy(function (err) {
    req.flash('success_msg', 'You Are successfully logged out');
      res.redirect('/login'); //Inside a callback… bulletproof!
   
  });

///infos
router.get('/info', ensureAuthenticated, (req,res) => {
  ojUser.findOne({ username: req.user.username}, function (err, usr2) {

    if (err) { return done(err); }
    res.render('infos', {
      username : req.user.username,
      fullname : req.user.fullname,
      email : req.user.email,
      cfUsername:usr2.cfUsername,
      codechefUsername:usr2.codechefUsername,
      uvaUsername:usr2.uvaUsername,
      hackerrankUsername : usr2.hackerrankUsername
    });
  });
  });
router.post('/info',(req,res) => {

  User.findOne({ username: req.body.username }, (err, usr) => {
    if (err) { throw err; }
   var user =new User();
   user.email=req.body.email;
   user.fullname=req.body.fullname;
   user.username=req.body.username;
   user.password=req.body.password;
   var ojuser = new ojUser();
   ojuser.username=req.body.username;
   ojuser.cfUsername=req.body.cfUsername;
   ojuser.codechefUsername=req.body.codechefUsername;
   ojuser.uvaUsername=req.body.uvaUsername;
   ojuser.hackerrankUsername=req.body.hackerrankUsername;
  
   if(user.password!=req.body.conpassword)
   {
       var passwordError= 'Password not matched';
       res.render("infos", {
           fullname : req.body.fullname,
           username : req.body.username,
           email : req.body.email,
           cfUsername:req.body.cfUsername,
           codechefUsername : req.body.codechefUsername,
           hackerrankUsername : req.body.hackerrankUsername,
           uvaUsername : req.body.uvaUsername,
           passwordError
       });
   }
   else if(req.body.password.length<1)
   {
       var passwordError='Password must be at least 8 characters';
       res.render("infos", {
           fullname : req.body.fullname,
           username : req.body.username,
           email : req.body.email,
           cfUsername:req.body.cfUsername,
           codechefUsername : req.body.codechefUsername,
           hackerrankUsername : req.body.hackerrankUsername,
           uvaUsername : req.body.uvaUsername,
           passwordError
       });
   }
   else{

       //if a user was found, that means the user's email matches the entered email
       bcrypt.genSalt(10, (err, salt) => {
           bcrypt.hash(user.password, salt, (err, hash) => {
               if(err) throw err;
               user.password=hash;
                    mongo.connect(url , (err,client) => {
                      var db= client.db('testdb');
                      if(err) throw err;
                      // user update
                      db.collection('users').updateOne({"_id":objectId(usr.id)}, {$set : {
                        fullname : req.body.fullname,
                        password : user.password
                      }},(err,result)=>
                        { if(err) throw err;
                    });

                    // online judge username update
                        ojUser.findOne({ username: user.username}, function (err, usr2) {
                          
                          if (err) { return done(err); }
                          db.collection('ojusernames').updateOne({"_id": objectId(usr2.id)},{$set : {
                            cfUsername:req.body.cfUsername,
                            codechefUsername : req.body.codechefUsername,
                            uvaUsername : req.body.uvaUsername,
                            hackerrankUsername : req.body.hackerrankUsername,
                          }},(err,result)=>
                          { if(err) throw err;
                      });
                        });
                        
                    });

                       req.flash('success_msg', 'Info updated Successfully')
                               res.redirect('/profile/info');
                   
           });
       });
      //scrap              
      scrap2(req);        
       }
      });
  })
  function scrap1(req)
  {
    ojUser.findOne({ username: req.user.username}, function (err, usr2) {
  
      if (err) { return done(err); }
    loadCf(usr2);
    loadhackerrank(usr2);
    loaduva(usr2);
    loadcodechef(usr2);
    });  
  }
  async function scrap2(req)
  {
    await loadCf(req.body);
    await loadhackerrank(req.body);
    await loaduva(req.body);
    await loadcodechef(req.body);   
  }
//cf scrap
async function loadCf(req)
{
  if(req.cfUsername!=''){
  var ojdetail=new ojdetails();
  //console.log(req.cfUsername);
 var cfurl='https://codeforces.com/contests/with/'+req.cfUsername;
 //div.datatable > div:nth-child(6) > table > tbody > tr:nth-child(1) > td:nth-child(6)
 //div.datatable > div:nth-child(6) > table > tbody > tr:nth-child(1)
 puppeteer
 .launch(
 //  {headless: false}
   //{devtools: true}
  { slowMo: 250}
 )
 .then(browser => browser.newPage())
 .then(page => {
   page.setExtraHTTPHeaders({
     'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
    });
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')
   return page.goto(cfurl , {waitUntil: 'networkidle2',timeout: 0} ).then(function() {
     return page.content();
   });
 })
 .then(html => {
  var $ =cheerio.load(html);
  var len1=$('div.datatable > div:nth-child(6) > table > tbody > tr').length;
  console.log(len1);
  var r = /\d+/;
  len1--;
  ojdetail.contest=len1;
  ojdetail.username='cf'+req.cfUsername;
  ojdetail.ojname=req.cfUsername;
  ojdetail.oj='codeforces';
  if(len1){
  ojdetail.rating=parseInt(($('div.datatable > div:nth-child(6) > table > tbody > tr:nth-child(1) > td:nth-child(7)')).text().match(r)[0]);
  ojdetail.lastContestRank=parseInt(($('div.datatable > div:nth-child(6) > table > tbody > tr:nth-child(1) > td:nth-child(4)')).text().match(r)[0]);
  var arr =[];
  var high=0;
  var sum=0;
  //#pageContent > div.datatable > div:nth-child(6) > table > tbody > tr:nth-child(1) > td:nth-child(2) > a
  for(var i=len1,j=1;i>=1;i--,j++)
  {
   var st='div.datatable > div:nth-child(6) > table > tbody > tr:nth-child('+j+')> td:nth-child(7)';
   var d=($(st)).text().match(r)[0]; 
   high=Math.max(high,d);
    arr.push([i,d]);
    sum+=parseInt($('div.datatable > div:nth-child(6) > table > tbody > tr:nth-child('+j+') > td:nth-child(5) > a').text().match(r)[0]);
  }
  ojdetail.previousRating=arr;
  ojdetail.highestRating=parseInt(high);
  ojdetail.solvedProblem=parseInt(sum);
 // console.log(ojdetail.highestRating + ' '+ojdetail.solvedProblem);
  ojdetails.findOne({ username:ojdetail.username}, function (err, usr2) {
     if(err) throw err;
     if(!usr2) 
     {
       ojdetail.save((err,doc) => {
         if(err) throw err;
       })
     }
     else
     {
      mongo.connect(url , (err,client) => {
       var db= client.db('testdb');
       db.collection('ojdetails').updateOne({"_id": objectId(usr2.id)},{$set : {
         username:ojdetail.username,
         ojname : ojdetail.ojname,
         oj : ojdetail.oj,
         contest : ojdetail.contest,
         solvedProblem : ojdetail.solvedProblem,
         rating : ojdetail.rating,
         highestRating :ojdetail.highestRating,
         lastContestRank : ojdetail.lastContestRank,
         previousRating : ojdetail.previousRating
       }},(err,result)=>
       { if(err) throw err;
   });
  });
     }

  })
}
 })
 .catch(console.error);

}
console.log('cf done');
}
/// hackerrank scrap
async function loadhackerrank(req)
{
  //#hacker-contest-score
  //#hacker-competitions
  //document.querySelector("#hacker-contest-score")

  var ojdetail=new ojdetails();
  if(req.hackerrankUsername!=''){
 var hackerrankurl='https://www.hackerrank.com/'+req.hackerrankUsername+'?hr_r=1';
 puppeteer
      .launch(
        { slowMo: 250}
        )
        .then(browser => browser.newPage())
        .then(page => {
          page.setExtraHTTPHeaders({
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
           });
           page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')
          return page.goto(hackerrankurl , {waitUntil: 'networkidle2',timeout: 0} ).then(function() {
            return page.content();
          });
        })
      .then(html => {
        const $ = cheerio.load(html);
        if($('#hacker-competitions').length>=1){
        var r = /\d+/;
        ojdetail.rating=parseInt($('#hacker-contest-score').text());
        ojdetail.contest=parseInt($('#hacker-competitions').text());
        ojdetail.lastContestRank=0;
        ojdetail.oj='hackerrank';
        ojdetail.ojname=req.hackerrankUsername;
        ojdetail.highestRating=0;
        ojdetail.previousRating=[];
        // ojdetail save/update
        var str='hackerrank'+req.hackerrankUsername;
        ojdetail.username=str;
        //console.log(str);
        ojdetails.findOne({ username:str}, function (err, usr2) {
          if(err) throw err;
          if(!usr2) 
          {
            ojdetail.save((err,doc) => {
              if(err) throw err;
            })
          }
          else
          {
           mongo.connect(url , (err,client) => {
            var db= client.db('testdb');
            db.collection('ojdetails').updateOne({"_id": objectId(usr2.id)},{$set : {
              username:str,
              oj : ojdetail.oj,
              contest : ojdetail.contest,
              solvedProblem : ojdetail.solvedProblem,
              rating : ojdetail.rating,
              highestRating :ojdetail.highestRating,
              lastContestRank : ojdetail.lastContestRank,
              previousRating : ojdetail.previousRating
            }},(err,result)=>
            { if(err) throw err;
        });
       });
          }
       })
      }
      })
      .catch(console.error);
}
console.log('hackerrank done');
}
//////////////////////////////////////////////////////
async function loaduva(req)
{
  //'body > div > div:nth-child(9) > p > b:nth-child(2)'
  var ojdetail=new ojdetails();
  if(req.uvaUsername!=''){
  var uvaurl='https://uhunt.onlinejudge.org/id/'+req.uvaUsername;
  puppeteer
      .launch(
      //  {headless: false}
        //{devtools: true}
       { slowMo: 250}
      )
      .then(browser => browser.newPage())
      .then(page => {
        page.setExtraHTTPHeaders({
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
         });
         page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')
        return page.goto(uvaurl , {waitUntil: 'networkidle2',timeout: 0} ).then(function() {
          return page.content();
        });
      })
      .then(html => {
        const $ = cheerio.load(html);
        var len= $('body > div > div:nth-child(9) > p > b:nth-child(2)').text();
        ojdetail.solvedProblem=parseInt(len);
        ojdetail.contest=parseInt($('body > div > div:nth-child(9) > p > b:nth-child(4)').text());
        ojdetail.lastContestRank=parseInt($('#ranklist_table > tbody > tr:nth-child(11) > td:nth-child(1)').text());
        var ar=[];
        for(var i=1;i<=len;i++)
        {
          var st='body > div > div:nth-child(9) > div:nth-child(5) > p > a:nth-child('+i+')';
          var x=parseInt($(st).text());
          ar.push([i,x]);
        }
        ojdetail.previousRating=ar;
        ojdetail.username='uva'+req.uvaUsername;
        ojdetail.ojname=req.uvaUsername;
        ojdetail.oj='uva';
        ojdetails.findOne({ username:ojdetail.username}, function (err, usr2) {
          if(err) throw err;
          if(!usr2) 
          {
            ojdetail.save((err,doc) => {
              if(err) throw err;
            })
          }
          else
          {
           mongo.connect(url , (err,client) => {
            var db= client.db('testdb');
            db.collection('ojdetails').updateOne({"_id": objectId(usr2.id)},{$set : {
              username:ojdetail.username,
              ojname:ojdetail.ojname,
              oj : ojdetail.oj,
              contest : ojdetail.contest,
              solvedProblem : ojdetail.solvedProblem,
              lastContestRank : ojdetail.lastContestRank,
              previousRating : ojdetail.previousRating
            }},(err,result)=>
            { if(err) throw err;
        });
       });
          }
     
       })
      })
      .catch(console.error);
   
  }
  console.log('uva done');


}

//////////////////////////////////////////////////
async function loadcodechef(req)
{
// body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-header.text-center > div.rating-number
  var ojdetail=new ojdetails();
  if(req.codechefUsername!=''){
  var codeurl='https://www.codechef.com/users/'+req.codechefUsername;
  puppeteer
      .launch(
      //  {headless: false}
        //{devtools: true}
       { slowMo: 250}
      )
      .then(browser => browser.newPage())
      .then(page => {
        page.setExtraHTTPHeaders({
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
         });
         page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')
        return page.goto(codeurl , {waitUntil: 'networkidle2',timeout: 0} ).then(function() {
          return page.content();
        });
      })
      .then(html => {
        const $ = cheerio.load(html);
        ojdetail.rating=parseInt($('body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-header.text-center > div.rating-number').text());
        var r = /\d+/;
        var str=($('body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-header.text-center > small').text()).match(r);
        
        if(str)
        {
          ojdetail.highestRating=str[0];
        }
        ojdetail.lastContestRank=parseInt($('body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-ranks > ul > li:nth-child(2) > a > strong').text());
        //ojdetail.solvedProblem=parseInt($('').text());
        str=($('body > main > div > div > div > div > div > section.rating-data-section.problems-solved > div > h5:nth-child(1)').text()).match(r);
        if(str)
        {
          ojdetail.solvedProblem=str[0];
        }
        ojdetail.contest=0;
        var arr=[];
        ojdetail.previousRating=arr;
        ojdetail.username='codechef'+req.codechefUsername;
        ojdetail.oj='codechef';
        ojdetail.ojname=req.codechefUsername;
        ojdetails.findOne({ username:ojdetail.username}, function (err, usr2) {
          if(err) throw err;
          if(!usr2) 
          {
            ojdetail.save((err,doc) => {
              if(err) throw err;
            })
          }
          else
          {
           mongo.connect(url , (err,client) => {
            var db= client.db('testdb');
            db.collection('ojdetails').updateOne({"_id": objectId(usr2.id)},{$set : {
              username:ojdetail.username,
              oj : ojdetail.oj,
              ojname:ojdetail.ojname,
              contest : ojdetail.contest,
              highestRating:ojdetail.highestRating,
              rating :ojdetail.rating,
              solvedProblem : ojdetail.solvedProblem,
              lastContestRank : ojdetail.lastContestRank,
              previousRating : ojdetail.previousRating
            }},(err,result)=>
            { if(err) throw err;
        });
       });
          }
     
       })
      })
      .catch(console.error);
      console.log('codechef done');
   
  }


}
async function loadcon()
{
     await loadcontest();
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

router.get('/friends', ensureAuthenticated, (req,res) => {

  usergroup.findOne({username:req.user.username} , (err, user) => {
    if(err) throw err;
    if(!user)
    {
      res.render("friends",{
        msg : "No group right now."
    });
    }
    else{
    res.render('friends' ,{
      member : user.friends
    })
    }
  });

});

router.post('/friends', ensureAuthenticated, (req,res) => {

 usergroup.findOne({username:req.user.username}, (err, us) => {
   if(err) throw err;
   var arr=us.friends;
   var ok=true;
   for(var i=0;i<arr.length;i++)
   {
     if(arr[i][0]==req.body.name)
     {
       ok=false;
       break;
     }
   }
   if(!ok)
   {
    req.flash('error_msg','User Already Added');
    res.redirect('/profile/friends/');
   }
   else{
  var ar=[];
  ar.push(req.body.name);
  ojUser.findOne({ username: req.body.name},(err, usr) => {
      if (err) { return done(err); }
      if(!usr)
      {
        req.flash('error_msg','No User Found With this name');
    res.redirect('/profile/friends/');
      }
      else {
      

     // console.log(usr);
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
                          mongo.connect(url , (err,client) => {
                          var db= client.db('testdb');
                          if(err) throw err;
                          // user update
                          db.collection('usergroups').updateOne({"_id":objectId(us.id)}, {$set : {
                            friends : arr
                          }},(err,result)=>
                          { if(err) throw err;
                            req.flash('success_msg','User Added');
                          res.redirect('/profile/friends/');
                          });

                          });
                                                
                                                    
                                                      })
                                      
                                          })
                                        
                                      })
                            
                            
                                  })
                            
                                }
                              });
                            
                            }
                            
                            });



})
router.post('/friends/:id/delete', (req,res) => {

  usergroup.findOne({username:req.user.username}, (err, us) => {
    if(err) throw err;
    var arr=us.friends;
    var temp=[];
    for(var i=0;i<arr.length;i++)
    {
      if(arr[i][0]==req.params.id)
      {
        continue;
      }
      temp.push(arr[i]);
    }
    mongo.connect(url , (err,client) => {
      var db= client.db('testdb');
      if(err) throw err;
      // user update
      db.collection('usergroups').updateOne({"_id":objectId(us.id)}, {$set : {
        friends : temp
      }},(err,result)=>
      { if(err) throw err;
        req.flash('success_msg','User Deleted');
      res.redirect('/profile/friends/');
      });

      });

   
     });
 })
 
module.exports=router;