const bcrypt = require("bcrypt");
const { validateNew, User, validateLogin } = require("../models/user");
const router = require("express").Router();
const _ = require("lodash");
const { route } = require("./dashboard");

router.post("/signup", async (req, res) => {
  //    console.log(req.body);
  // return
  const result = validateNew(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  } else {
    const user = await User.findOne({ Email: req.body.Email });
    console.log(user);
    if (user) {
      res.status(400).send("User Already Registered");
      return;
    }

    var newUser = new User(
      _.pick(req.body, [
        "Fname",
        "Lname",
        "Uname",
        "Avatar",
        "Email",
        "Password",
        "isAdmin",
      ])
    );
    //the salt is going to be added to the original password in the process of hashing
    var salt = await bcrypt.genSalt(10);
    //hashing the password
    newUser.Password = await bcrypt.hash(newUser.Password, salt);
    newUser = await newUser.save();
    console.log("User::" + newUser);
    const token = newUser.genToken();
    res.cookie("AuthToken", token, "localhost:4000/");
    res.status(200).send("Successful");
  }
});
router.post('/signin',async (req,res)=>{
    const result=validateLogin(req.body)
    // console.log(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
    }
    else
    {
        var user=await User.findOne({Email:req.body.Email})
        if(!user)
       return res.status(400).send("Invalid Email or Password");
    // console.log(user);
    const isValid=await bcrypt.compare(req.body.Password,user.Password)
    if(!isValid){
       return res.status(400).send("Invalid Email or Password");
    }
    var token=user.genToken()
    // res.status(200).header('x-token',token)
    res.cookie('AuthToken',token,'localhost:4000/')
    res.status(200).send("token successful sent ")
    }
    })

router.get("/", (req, res) => {
  res.send("Hola Todos");
});
module.exports = router;
