const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    id:Number,
    first_name:String,
    last_name:String,
    email:String,
    gender:String,
    avatar:String,
    domain:String,
    available:{
        type:Boolean,
        default:true
    }
})


//userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);