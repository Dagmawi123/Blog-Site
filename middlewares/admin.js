const jwt=require('jsonwebtoken')
require('dotenv').config()
module.exports=function(req,res,next){
try{
    console.log('Checking if you are an admin...')
    if(!req.cookies.AuthToken)
    {
       return res.status(401).send('You are not allowed to perform this action') 
    }
const user=jwt.verify(req.cookies.AuthToken,process.env.Jwt_Secret)
if(user.Admin){
  next()  
}
else
return res.status(403).send('<h1>Sorry,You are forbidden to perform this action<h1>') 

}
catch(ex){
    res.status(400).send("Sorry!The token sent is invalid! "+ex.message)
}
}