const mongoose =require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ojdetailsSchema =new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true
    },
    ojname :{
        type : String,
    },
    oj :{
        type : String,
    },
    contest :{
        type : Number,
        default:0
    },
    solvedProblem :{
        type : Number,
        default:0
    },
    rating : {
        type : Number,
        default:0
    },
    highestRating : {
        type : Number,
        default:0
    },
    lastContestRank : {
        type : Number,
        default:0
    },
    previousRating : {
        type : Array,
        "default" : []
    }


});

ojdetailsSchema.plugin(uniqueValidator,  { message: '{PATH} already exist' });
mongoose.model('ojdetails',ojdetailsSchema);