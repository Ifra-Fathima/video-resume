const { default: mongoose } = require("mongoose");

const UserSchema= mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    role:{type:String, enum:["jobseeker","recruiter","admin"]}
})

module.exports=mongoose.model("User", UserSchema)