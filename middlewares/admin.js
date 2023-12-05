const jwt=require('jsonwebtoken')
module.exports=function(req,res,next){
try{
    console.log('Checking if you are an admin...')
    if(!req.cookies.AuthToken)
    {
       return res.status(401).send('You are not allowed to perform this action') 
    }
const user=jwt.verify(req.cookies.AuthToken,"myKey")
if(user.Admin){
  next()  
}
else
return res.status(403).send('You are forbidden to perform this action') 

}
catch(ex){
    res.status(400).send("Sorry!The token sent is invalid! "+ex.message)
}
}