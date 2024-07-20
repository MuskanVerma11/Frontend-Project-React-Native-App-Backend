const express=require("express");
const app=express();
const mongoose=require("mongoose");
app.use(express.json());
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const mongoUrl="mongodb+srv://muskanvermabsp:projectintern321mv@cluster0.ktxyncf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const JWT_SECRET="asdlkfjapwieorjlksnxouiwernw893392847ksfiuafjbaeoiknenfw;oe";

mongoose
    .connect(mongoUrl)
    .then(()=>{
        console.log("Database Connected")
    }).catch((e)=>{
        console.log(e);
    });

require('./UserDetails')

const User=mongoose.model("UserInfo");

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.post("/register",async(req,res)=>{
    const {userName, email, password}=req.body;

    const oldUser=await User.findOne({email:email});

    if(oldUser){
        return res.send({data:"User Already Exist!"});
    }
    const encryptedPassword=await bcrypt.hash(password,10);

    try{
        await User.create({
            userName:userName,
            email:email,
            password:encryptedPassword
        });
        res.send({status:"ok", data:"User Created"});
        console.log(User);
    }catch(error){
        res.send({status:"error", data:error});
    }
});

app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    const oldUser=await User.findOne({email:email});

    if(!oldUser){
        return res.send({data:"User doesn't exist!!"})
    }

    try{
        if(await bcrypt.compare(password,oldUser.password)){
            const token=jwt.sign({email:oldUser.email}, JWT_SECRET);
            if(res.status(201)){
                console.log(res);
                return res.send({status:"ok", data:token});
            }else{
                console.log(res);
                return res.send({error:"error"});
            }
        }
    }catch(error){
        console.log(error);
    }
})

app.listen(5001,()=>{
    console.log("Server Started");
})

