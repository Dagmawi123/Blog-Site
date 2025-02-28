const express=require('express')
const cookieParser=require('cookie-parser')
const dashboard=require('../routes/dashboard')
const Router=require('../routes/user')
const cors=require('cors')
const blog=require('../routes/blog')
module.exports=(app)=>{
app.use(express.static("public"));
app.set('view engine','ejs')
app.use(cookieParser())

app.use(cors({origin: '*'})); 
// const authMiddleware=require('../middlewares/auth')
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/users/',Router)
app.use('/dashboard/',dashboard)
app.use('/blog/',blog)    
}
