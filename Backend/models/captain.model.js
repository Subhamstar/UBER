const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const captainSchema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name must be at least 2 characters long'],
            maxlength:[50,'First name must be at most 50 characters long']
        },
        lastname:{
            type:String,
            minlength:[3,'Last name must be at least 2 characters long'],
            maxlength:[50,'Last name must be at most 50 characters long']
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:{
            validator:function(v){
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message:'Please enter a valid email address'
        }
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    soketId:{
        type:String,
        default:null
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength
        },
        plate:{
            type:String,
            required:true,
            minlength:[3,'Plate number must be at least 7 characters long'],
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,'Capacity must be at least 1'],
            max:[100,'Capacity must be at most 100']
        },
        vehicleType:{
            type:String,
            enum:['car','motorcycle','auto'],
            required:true
        },
    },
    location:{
        lat:{
            type:Number,
        },
        lng:{
            type:Number,
        }
    }
})

captainSchema.methods.genarateAuthToken=async function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    return token;
}

captainSchema.methods.comparePassword=async function(password){
    const isMatch=await bcrypt.compare(password,this.password);
    return isMatch;
}
captainSchema.statics.hashPassword=async function(password){
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    return hashedPassword;
}

const captainModel=mongoose.model('captain',captainSchema);

module.exports=captainModel;