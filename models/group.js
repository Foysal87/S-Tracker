const mongoose =require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var groupSchema =new mongoose.Schema({

    name : {
        type :String,
        required:true
    },
    userid :{
        type : String,
        required : true,
        unique : true
    },
    user:{
        type : Array,
        "default" : []
    },

});

groupSchema.plugin(uniqueValidator,  { message: '{PATH} already exist' });
mongoose.model('group',groupSchema);