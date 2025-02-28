const mongoose=require('mongoose')
module.exports= ()=>{
    return(
    mongoose.connect("mongodb://127.0.0.1:27017/Blog",{
   useNewUrlParser: true,
  useUnifiedTopology: true   
}).then(()=>{console.log("Connected to mongodb...");})
.catch((err)=>{console.error("Couldn't connect "+err)}))
}
