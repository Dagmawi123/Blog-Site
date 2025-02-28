module.exports=function(err,req,res,next){
   console.log("Error ");
   console.error(err.stack); 
   return res.status(500).send("<h2>Encountered Internal server error!!</h2>"+err.message)    
}