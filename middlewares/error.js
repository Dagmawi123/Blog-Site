module.exports=function(err,req,res,next){
res.status(500).send("<h2>Encountered Internal server error!!</h2>")    
}