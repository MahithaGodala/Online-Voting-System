const express=require('express');
const app=express();
const mongoose=require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/AI&DS_B84",(err)=>{
if(err)
console.log("DB NOT CONNECTED-ERROR");
else
console.log("DB CONNECTED");
});
const ns=new mongoose.Schema({
name:String,
age:Number,
rno:String,
phoneN0:Number
});
const nm=new mongoose.model("records",ns);
const data1=new nm({name:'mahitha',age:19,rno:'21761A5484',phoneNo:8074647986});
data1.save();
const data2=new nm({name:'Tejaswini',age:16,rno:'21761A5485',phoneNO:8074647989});
data2.save();
const data3=new nm({name:'Pramodh',age:20,rno:'21761A5486',phoneNO:8074647999});
data3.save();


