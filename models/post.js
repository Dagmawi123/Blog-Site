const mongoose=require('mongoose')
const Joi=require('joi')

const postSchema=new mongoose.Schema({
  Title:{type:String,required:true,minLength:10},
  Body:{type:String,required:true,minLength:30},
  Category:{
    type:new mongoose.Schema({
    Title:{type:String,required:true,minLength:3}
  }),
  required:true,minLength:3},
  Thumbnail:{type:String ,default:'none'},
  isFeatured:{type:Boolean,default:false},
  Date:{type:String,default:function(){const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
  return formattedDate}},
  Author:{type:new mongoose.Schema({
    Fname:String,
    Lname:String,
    Avatar:String  
   })}
})
const Post=mongoose.model('post',postSchema)
function validatePost(post){
    const Schema={
        Title:Joi.string().min(5).required(),
        Body:Joi.string().min(30).required(),
        //should Be categoryID
        CategoryId:Joi.string().min(3).max(50).required(), 
        isFeatured:Joi.boolean(),
        Thumbnail:Joi.string().min(5),
        Date:Joi.date(),
        AuthorId:Joi.string().required()
       }
   return Joi.validate(post,Schema)
  }
  function validateEditedPost(post){
    const Schema={
        Title:Joi.string().min(5).required(),
        Body:Joi.string().min(30).required(),
        //should Be categoryID
        CategoryId:Joi.string().min(3).max(50).required(), 
        isFeatured:Joi.boolean(),
        Thumbnail:Joi.string(),
        Date:Joi.date()
        // AuthorId:Joi.string().required()
       }
   return Joi.validate(post,Schema)
  }
module.exports.Post=Post
module.exports.validateNewPost=validatePost
module.exports.validateOldPost=validateEditedPost
