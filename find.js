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
rno:String
});
const nm=new mongoose.model("records",ns);
nm.findOne({age:16},function(err,data){
if(err){
console.log(err);
}
else{
console.log("First function call:",data);
}
});
