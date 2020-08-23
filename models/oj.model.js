const mongoose =require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ojSchema =new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true
    },
    cfUsername :{
        type : String,
        default:''
    },
    codechefUsername :{
        type : String,
        default:''
    },
    uvaUsername :{
        type : String,
        default:''
    },
    hackerrankUsername :{
        type : String,
        default:''
    }

});

ojSchema.plugin(uniqueValidator,  { message: '{PATH} already exist' });
mongoose.model('ojUsername',ojSchema);