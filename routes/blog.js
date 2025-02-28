const { Post } = require('../models/post')
const mongoose=require('mongoose')
const router=require('express').Router()

router.get('/',async(req,res)=>{

    if(req.query.searchTerm){
        const posts=await Post.find({Title:{$regex:req.query.searchTerm, $options: "i"}})
        // console.log("Posts found ",posts);
        
        if(posts.length!=0){
        return res.render('blog',{post:posts})   
        }   
        return res.render('blog',{post:[]})  
            }
            else if(req.query.searchTitle){
                const posts=await Post.find({"Category.Title":req.query.searchTitle})
                // console.log("Posts found ",posts);
                
                if(posts.length!=0){
                return res.render('blog',{post:posts})   
                }   
                return res.render('blog',{post:[]})  

            }


// console.log("Sent token: "+req.body.UserToken);
// return
var posts =await Post.find().sort({name:1})
// console.log(posts);
// if(req.body.token)
res.render('blog',{post:posts})
})




//viewing individual posts
router.get('/post/:id',async(req,res)=>{
try{
    // console.log("inside /blog/post");
var post=await Post.findById(req.params.id)
if(!post)
return res.status(400).send("Post Not Found!")
res.render('read_post',{post:post})
}
catch(ex){console.log("Have an exception  "+ex.message);}
}) 
module.exports=router