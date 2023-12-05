const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const cookieParser = require('cookie-parser');
// const bcrypt=require('bcrypt')
// const config=require('config')
// const JWT=require('jsonwebtoken')
// const User=mongoose.model('User')
const {validateNew,User,validateLogin}=require('../models/user')
const router=require('express').Router()
const _=require('lodash')


router.post('/',async(req,res)=>{
//    console.log(req.body);
   // return
const result=validateNew(req.body)
if(result.error){
    res.status(400).send(result.error.details[0].message);
}
else{
    const user=await User.findOne({Email:req.body.Email})
    console.log(user);
    if(user){
        res.status(400).send("User Already Registered");
    return
    }
    
    var newUser=new User(_.pick(req.body,['Fname','Lname','Uname','Avatar','Email','Password','isAdmin']))
    //the salt is going to be added to the original password in the process of hashing
var salt=await bcrypt.genSalt(10)
//hashing the password
newUser.Password=await bcrypt.hash(newUser.Password,salt)
newUser=await newUser.save()    
console.log("User::"+newUser);
// res.render('index',{
//     profile:"images/"+newUser.Avatar
// })
const token=newUser.genToken()
res.cookie('AuthToken',token,'localhost:4000/')
res.status(200).send('Successful')
//for a custom header send in the response header we prefix it using 'x-'

// res.redirect('file://C:/Users/user/Documents/Blog Site/index.html')
}})
// router.get('/me',authMiddleware,async(req,res)=>{
//     //  req.user._id is obtained from the payload of the token
// const user=await User.findById(req.user._id).select('-passWord')
//     res.send(user) 
// })
router.get('/',(req,res)=>{
    res.send('Hola Todos')
})
module.exports=router