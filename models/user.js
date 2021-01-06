const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const Token=require('../models/token')

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        max:100
    },
    firstName:{
        type:String,
        required:'First name is required',
        max:100
    },
    lasttName:{
        type:String,
        required:'last name is required',
        max:100
    },
    bio:{
        type:String,
        required:false,
        max:255
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:{
        type:String,
        required:false
    },
    resetPasswordExpires:{
        type:Date,
        required:false
    }    
},
{timestamps:true});

UserSchema.pre('save',function(next){  //keep in mind arrow function can't be used here because it does not bind
    const user=this;
    if(!user.isModified('password'))return next();

    bcrypt.genSalt(10,(err,salt)=>{

        if(err)return next(err);

        bcrypt.hash(user.password,salt,(err,hash)=>{
            user.password=hash;
            next();
        })
    })
})

UserSchema.methods.comparePassword=(password)=>{
    return bcrypt.compareSync(password,this.password);
}

UserSchema.methods.generateJWT=()=>{
    const today=new Date();
    const expirationDate=new Date(today);
    expirationDate.setDate(today.getDate()+60);

    let payload={
        id:this.id,
        email:this.email,
        username:this.username,
        firstName:this.firstName,
        lastName:this.lastName
    }

    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:parseInt(expirationDate.getTime()/1000,10)})

}

UserSchema.methods.generateVerificationToken=()=>{
    let payload={
        userId:this._id,
        token: crypto.randomBytes(20).toString('hex')
    }
    return new Token(payload);
}

module.exports=mongoose.model('Users',UserSchema);