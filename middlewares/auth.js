const cookieParser=require('cookie-parser')
const jwt=require('jsonwebtoken')
require("dotenv").config()
module.exports=function(req,res,next){
try {
    // console.log('Authenticating...')
    if(!req.cookies.AuthToken)
    {
       return res.status(401).send('You are not allowed to perform this action') 
    }
const user=jwt.verify(req.cookies.AuthToken,process.env.Jwt_Secret)
next()

} catch (error) {
    return res.status(400).send('Invalid token sent') 
}
}