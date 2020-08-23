const mongoose =require('mongoose');

mongoose.connect('mongodb://localhost:27017/testdb', 
    {useNewUrlParser : true},(err) => {
        if(!err) {console.log('Mongodb connected.'); }
        else {console.log('error in db connection : '+ err); }
});
require('./user.model');
require('./oj.model');
require('./contest.model.');
require('./ojdetails');
require('./groups.model');
require('./group');