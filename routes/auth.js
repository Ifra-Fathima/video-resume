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
        const newUser=new User({name,email,password:hashedPassword,role})
        await newUser.save();
        res.status(201).json({message:"User registered Successfully!!!"})
        

    }
    catch(err){
        res.status(500).json({message:"Server error",error:err.message})
    }
});

router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"1d"})
        res.status(200).json({token,user})
    }catch(err){
        res.status(500).json({message:"Server Error",error:err.message})
    }
})

module.exports=router;
