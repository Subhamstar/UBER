const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name must be at least 3 characters'],
            maxlength:[20,'First name must be at most 20 characters'],
        },
        lastname:{
            type:String,
            minlength:[3,'Last name must be at least 3 characters'],
            maxlength:[20,'Last name must be at most 20 characters'],
        },
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function(v){
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message:(props)=>`${props.value} is not a valid email!`
        }
    },
    password:{
        type:String,
        required:true,
        select:false,
        minlength:[6,'Password must be at least 6 characters'],
        maxlength:[20,'Password must be at most 20 characters'],
    },
    socketId:{
        type:String,
        default:null,
    },
})


userSchema.methods.generateAuthToken=async function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    return token;
} 

userSchema.methods.comparePassword=async function(password){
    const isMatch=await bcrypt.compare(password,this.password);
    return isMatch;
}
userSchema.statics.hashPassword=async function(password){
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    return hashedPassword;
}


const userModel=mongoose.model('user',userSchema);

module.exports=userModel;