const mongoose =require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema =new mongoose.Schema({
    email :{
        type : String,
        required : true ,
        unique : true   
    },
    fullname : {
        type : String,
        required : "fullname is required"
    },
    username :{
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        required : true
    }

});
userSchema.path('email').validate((val) => {
 return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val); 
},'Invalid Email');

userSchema.plugin(uniqueValidator,  { message: '{PATH} already exist' });
mongoose.model('User',userSchema);