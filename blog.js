const express=require('express')
const app=express()
const {Post}=require('./models/post')
const {Category}=require('./models/category')
const {User,validateLogin}=require('./models/user')
const bcrypt=require('bcrypt')
const _=require('lodash')   
const jwt=require('jsonwebtoken')
require('express-async-errors')
require('dotenv').config()
//
//server defining
const port=process.env.PORT||4000 
// app.use(cors('*'))
require('./start/db')()
require('./start/middlewares')(app)
//rendering home page
app.get('/',async (req,res)=>{
    if(req.cookies.AuthToken)
    {
        try{
            const userObj=jwt.verify(req.cookies.AuthToken,process.env.Jwt_Secret)//object that have only _id
            const aUser=await User.findById(userObj._id)
            if(aUser){ 
                const featuredPost=await Post.findOne({isFeatured:true}).sort({Date:-1})
                if(!featuredPost)
                featuredPost=await Post.findOne().sort({Date:-1})
                var posts =await Post.find().sort({name:1})
                var Categories=await Category.find().sort({name:1})
                res.render('index',{profile:'images/'+aUser.Avatar,post:posts,featured:featuredPost,cats:Categories})   
            }
            
      }
 catch(ex){console.log("Error "+ex.message)  }
  }
    else{
const featuredPost=await Post.findOne({isFeatured:true}).sort({Date:-1})
if(!featuredPost)
featuredPost=await Post.findOne().sort({Date:-1})
var posts =await Post.find().sort({name:1})
var Categories=await Category.find().sort({name:1})
return res.render('index',{profile:'',post:posts,featured:featuredPost,cats:Categories})
  }
})

// res.redirect('./index.html')
// })

//logging out
app.get('/logout',(req,res)=>{
res.clearCookie('AuthToken')
res.redirect('./')})





async function createPost(){
var post=new Post({
    Title:"7 former Arsenal players we can’t believe are still playing in 2023",
Body:"Cazorla signed for Arsenal in 2012 in a deal worth £10m and made 180 appearances for the Gunners, scoring 29 goals.He won two FA Cups and two Community Shields with Arsenal, becoming a fan’s hero in the process, and also lifted the European Championship with Spain in 2008 and 2012.At the age of 38, he made an emotional return to boyhood club Real Oviedo this summer.Playing their football in the Segunda Division, the Asturian side wouldn’t normally be able to afford a player of such calibre, but Cazorla has agreed to play for the minimum wage allowed by the Spanish football authorities.And Oviedo’s youth academy will receive 10% of Cazorla’s shirt sales after he gave up all image rights to the club. What a guy."
,
Category:{Title:"Sport"},
Thumbnail:"santi.jpg",
Author:{Fname:"Dagmawi",Lname:"Aschalew",Avatar:"santi.jpg"}
})
await post.save()
}

async function createCats(){
    var cats=new Category({
        Title:"Art",
    Description:"The plays everyone enjoys to see"
        })
    await cats.save()
    }

// createCats()




//rendering posts for a specific category
app.get('/category',async(req,res)=>{

     if(req.query.searchTitle){
                const posts=await Post.find({"Category.Title":req.query.searchTitle})
                // console.log("Posts found ",posts);
                
                if(posts.length!=0){
                return res.render('category_posts',{post:posts,cat:req.query.searchTitle})   
                }   
                return res.render('category_posts',{post:[],cat:''})  

            } 
var posts =await Post.find().sort({name:1}) 
res.render('blog',{post:posts})
})



app.use(require('./middlewares/error'))

app.listen(port,()=>{
    console.log("Listening on port "+port);
})