const router=require('express').Router()
const authorize=require('../middlewares/auth')
const { Category } = require('../models/category')
// const { validateOldPost, Post } = require('../models/post')
const {Post,validateNewPost,validateOldPost}=require('../models/post')
// const {Post}=require('../models/post')
const jwt=require('jsonwebtoken')
const { User, validateNew } = require('../models/user')
const validateCat=require('../models/category').validate
const adminstrator=require('../middlewares/admin')
const bcrypt=require('bcrypt')
const _=require('lodash')
require('dotenv').config()
router.get('/',authorize,async(req,res)=>{
    try{
        // console.log('Received token: '+req.body.UserToken)
const userObj=jwt.verify(req.cookies.AuthToken,process.env.Jwt_Secret)//object that have only _id

if(userObj.Admin){
    const Posts=await Post.find().sort({Title:1})
res.render('dashboard',{posts:Posts})
}
else{
    // const aUser=await User.findById(userObj._id) 
    const userPosts=await Post.find({"Author._id":userObj._id})
res.render('dashboard',{posts:userPosts})
}

}
    catch(ex){console.log(ex.message)
    process.exit(2);
    }
  
    })
router.get('/edit/:id',authorize,async(req,res)=>{
    try{
    var post=await Post.findById(req.params.id)
    var categos=await Category.find().select('-Description')
    console.log("Believe IT!!");
    
    if(req.params.id){
      res.render('edit_post',{post:post,categos:categos})  
    }
    }
    catch(ex){
        console.log(ex.message);
    }
    })

    router.put('/edit/save/:id',async(req,res)=>{
        try{  console.log('saving...');
          const result=validateOldPost(req.body)
          if(result.error){
              //  console.log("on error");
              // console.log(req.body);
              res.status(400).send(result.error.details[0].message);
          }
      
          else{
              // console.log("not on error")
              const cat=await Category.findById(req.body.CategoryId).select('-Description')
             var updatedPost= {
                  Title:req.body.Title,
                  Body:req.body.Body,
                  Category:{_id:cat._id,Title:cat.Title},
                  Thumbnail:req.body.Thumbnail,
                  isFeatured:req.body.isFeatured
                 }
                  if(!updatedPost.Thumbnail)
                  delete updatedPost.Thumbnail
                  if(!updatedPost.isFeatured)
                  updatedPost.isFeatured=false;
              const post=await Post.findByIdAndUpdate(req.params.id,updatedPost)
                  // await post.save()
                  if(post){
                      console.log("Change Saved!");
                      //  console.log(post);
                      res.status(200).send("Well and Fine");
                  }
                  else{
                  console.log('There is no Post with this id!')
              res.status(404).send('No Post with this ID')
                  }
             
      
              
      }
      
      }catch(ex){console.log(ex.message);}
      })

      router.delete('/delete/:id',authorize,async(req,res)=>{
        try{
    var post=await Post.findByIdAndDelete(req.params.id)
    if(post){
        res.status(200).send("Successful Deletion")
    }    
    else
    res.status(404).send("There is no post with the sent Id")
    }        
        
        catch(ex){console.log(ex.message);}
    })
    
    //rendering the add new post page
router.get('/add',authorize,async(req,res)=>{
    try{
var categos=await Category.find().select('-Description')
res.render('new_post',{categos:categos})    
}
catch(ex){console.log(ex.message);}
})

router.post('/add/save',async(req,res)=>{
  
    try{  console.log('saving...');
    var userId=jwt.verify(req.cookies.AuthToken,process.env.Jwt_Secret) 
    // console.log("The decoded userId: "+userId._id);  
    req.body.AuthorId=userId._id
    // delete req.body.token
    // console.log("Line 163");+
    const result=validateNewPost(req.body)
    if(result.error){
        //  console.log("on error");
        // console.log(req.body);
        res.status(400).send(result.error.details[0].message);
    }

    else{
       
        // console.log("not on error")
        const cat=await Category.findById(req.body.CategoryId).select('-Description')
        var user=await User.findById(req.body.AuthorId)
        if(!user){
           return res.status(400).send("Can not find the user with the given AuthorId"); 
        }
      
        var post={
            Title:req.body.Title,
            Body:req.body.Body,
            Category:{_id:cat._id,Title:cat.Title},
            Thumbnail:req.body.Thumbnail,
            Author:{_id:user._id,Fname:user.Fname,Lname:user.Lname,Avatar:user.Avatar},
            isFeatured:req.body.isFeatured
           } 
      
           if(!post.Thumbnail)
            delete post.Thumbnail
            if(!post.isFeatured)
            post.isFeatured=false;       
        // console.log("The Post to be saved: ",post);
       var newPost= new Post(post)
       newPost=await newPost.save()
           
        // const post=await Post.findByIdAndUpdate(req.params.id,newPost)
            // await post.save()
            if(newPost){
                console.log("Post Added!");
                //  console.log(post);
                res.status(200).send("Well and Fine");
            }
            
       

        
}

}catch(ex){console.log(ex.message);}
})
    //rendering the addUser page
    router.get('/add_user',adminstrator,(req,res)=>{
        res.render('new_user')
    })
    
        //saving the user
    router.post('/add_user/save',async(req,res)=>{
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
            // const token=newUser.genToken()
            res.status(200).send("Successful+sent token")
            
            //for a custom header send in the response header we prefix it using 'x-'
            
            // res.redirect('file://C:/Users/user/Documents/Blog Site/index.html')
            }})
    
    //rendering manage users page
    
    router.get('/manage_users',adminstrator,async(req,res)=>{
        try {
            // console.log('coming to me');
    const users=await User.find({isAdmin:false})
          res.render('manage_users',{users:users})  
        } catch (error) {
            console.log(error.message);
        }
        
    })
    
    
    //deleting a user
    router.delete('/manage_users/delete/:id',async(req,res)=>{
    try {
     const user=await User.findByIdAndRemove(req.params.id)
     if(!user)
     res.status(404).send('User not found')   
    else
    res.status(200).send('success')
    } catch (error) {
        console.log(error.message);
    }
    })
    
    //for rendering add categories page
    
    router.get("/add_categories",adminstrator,(req,res)=>{
        res.render('add_category')
    })
    
    //saving a new category
    router.post('/add_categories/save',async(req,res)=>{
     try {
        const result=validateCat(req.body)
        if(result.error){
      return  res.status(400).send(result.error.details[0].message); 
    }
    var cat=await Category.findOne({Title:req.body.Title})
    if(cat){
    console.log(cat);
    return res.status(400).send('Category already exists!')
    
    }
    cat=new Category({Title:req.body.Title,Description:req.body.Description})
    await cat.save()
    res.status(200).send('Category added!')
     } catch (error) {
        console.log(error.message);
     }   
    })
    
    //rendering manage category page
    router.get('/manage_categories',adminstrator,async(req,res)=>{
        const cat=await Category.find({}).sort({Title:1})
        res.render('manage_categories',{cats:cat})
    })
    
    //rendering the edit_Categories page
    router.get('/manage_categories/edit/:id',authorize,async(req,res)=>{
    try{
    const cat=await Category.findById(req.params.id)
    if(cat)
    res.render('edit_Category',{category:cat})
    }
    catch(ex){
        console.log(ex.message);
    }
    })
    
    router.put('/manage_categories/edit/save/:id',async(req,res)=>{
    try {
        const result=validateCat(req.body)
        if(result.error){
            return  res.status(400).send(result.error.details[0].message); 
          }
       const cat=await Category.findByIdAndUpdate(req.params.id,{Title:req.body.Title,Description:req.body.Description})   
    if(cat)
    res.status(200).send('Category Updated')
    
    } catch (error) {
        
    }    
    })
    
    router.delete('/manage_categories/delete/:id',async(req,res)=>{
    
        try {
            const cat=await Category.findByIdAndDelete(req.params.id)
            if(cat)
            res.status(200).send("Deletion Successful")
        } catch (error) {
            
        }
    })




module.exports=router