const mongoose=require('mongoose')
const Joi=require('joi')
const JWT=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
  Fname:{type:String,required:true,minLength:3},
  Lname:{type:String,required:true,minLength:3},
  Uname:{type:String,required:true,minLength:3},
  Email:{type:String,required:true,minLength:7},
  Password:{type:String,required:true,minLength:5},
  Avatar:{type:String,default:'none'},
  isAdmin:{type:Boolean,default:false}
})
userSchema.methods.genToken=function(){
  console.log("Have ur secret key! "+process.env.Jwt_Secret);
  const token=JWT.sign({_id:this._id,Admin:this.isAdmin},process.env.Jwt_Secret)
  return token
}
const User=mongoose.model('User',userSchema)
function validateUser(user){
    const Schema={
        Fname:Joi.string().min(3).max(50).required(),
        Lname:Joi.string().min(3).max(50).required(),
        Uname:Joi.string().min(3).max(50).required(),
        Email:Joi.string().min(7).max(255).required().email(),
Password:Joi.string().min(5).max(255).required(),
Avatar:Joi.string(),
isAdmin:Joi.boolean()      
       }
   return Joi.validate(user,Schema)
  }

//validating on login
function validateLogin(user){
  const Schema={
    Email:Joi.string().min(7).max(255).required().email(),
Password:Joi.string().min(5).max(255).required()  
     }
 return Joi.validate(user,Schema)
}


module.exports.validateNew=validateUser
module.exports.User=User
module.exports.validateLogin=validateLogin