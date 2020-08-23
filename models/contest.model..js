const mongoose =require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var contestSchema =new mongoose.Schema({
    date : { type : String,
            required : true,
            unique:true
    },
    len : {
        type : Number
    },
    contest : {
        type : Array,
        "default" : []
    }
});

contestSchema.plugin(uniqueValidator,  { message: '{PATH} already exist' });
mongoose.model('contestSchedule',contestSchema);