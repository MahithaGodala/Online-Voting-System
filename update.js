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
phno:Number
});
const nm=new mongoose.model("records",ns);
var myquery={name:"Tejaswini"};
var newvalues={$set:{phno:4356783456}};
nm.updateOne(myquery,newvalues,function(err,res)
{
if(err) throw err;
console.log("1 document updated");
});