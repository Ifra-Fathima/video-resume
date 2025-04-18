const mongoose=require("mongoose")
const express=require("express")
const dotenv=require("dotenv")
const cors=require("cors")
const app=express()

dotenv.config();

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>console.log("MongoDB Connected"))
.catch((err)=> console.error("MongoDB connection error",err))

const PORT=process.env.PORT||3001

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})