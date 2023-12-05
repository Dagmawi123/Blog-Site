const mongoose=require('mongoose')
const Joi=require('joi')

const categorySchema=new mongoose.Schema({
  Title:{type:String,required:true,minLength:3},
  Description:{type:String,required:true,minLength:10},
})
const Category=mongoose.model('categories',categorySchema)
function validatecategory(category){
    const Schema={
        Title:Joi.string().min(3).required(),
        Description:Joi.string().min(10).required()              
       }
   return Joi.validate(category,Schema)
  }

module.exports.validate=validatecategory
module.exports.Category=Category