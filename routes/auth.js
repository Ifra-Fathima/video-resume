const express=require("express")
const router=express.Router()
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const User=require("../models/User")

router.post("/register",async(req,res)=>{
    try{
        const{name,email,password,role}=req.body
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        const hashedPassword=await bcrypt.hash(password,10)
    }
});

module.exports=
