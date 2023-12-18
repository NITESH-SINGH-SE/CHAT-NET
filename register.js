const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    score:{
        type:Number,
        required:true
    },
    delete:{
        type:Boolean,
        required:true
    }
})

employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, "mynameisvinodbahadurthapayoutuber");
        console.log(token);
        return token;
    }catch(error){
        res.send("The error part "+ error);
        console.log("The error part "+ error);
    }
}


// now we need to create a collections

const Register = new mongoose.model("Register", employeeSchema);

module.exports=Register;