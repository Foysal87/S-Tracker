const mongoose =require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var groupsSchema =new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true
    },
    groups :{
        type : Array,
        "default" : []
    },
    friends :{
        type : Array,
        "default" : []
    },
});

groupsSchema.plugin(uniqueValidator,  { message: '{PATH} already exist' });
mongoose.model('userGroups',groupsSchema);