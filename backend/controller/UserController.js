const User= require("../models/UserModel")
const bcrypt= require("bcrypt")
const jwt= require("jsonwebtoken");

const JWT_SECRET= process.env.JWT_SECRET;

function GenerateJWT(userid,useremail){
   return jwt.sign({id:userid, email:useremail},JWT_SECRET,{expiresIn:"7d"})
}

async function Register(req,res) {
    try{
        const{name, email, password}= req.body
        //Validation
        if (!name || !email || !password) return res.status(400).json({message:"missing fields"});

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({message:"Invalid email format"});

        // Password strength validation
        if (password.length < 8) return res.status(400).json({message:"Password must be at least 8 characters"});
        if (!/[A-Z]/.test(password)) return res.status(400).json({message:"Password must contain an uppercase letter"});
        if (!/[a-z]/.test(password)) return res.status(400).json({message:"Password must contain a lowercase letter"});
        if (!/\d/.test(password)) return res.status(400).json({message:"Password must contain a number"});
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return res.status(400).json({message:"Password must contain a special character"});

        //look through data base and find if registered email is exist
        const existEmail= await User.findOne({email});
        if (existEmail) return res.status(400).json({message:"email is already exist"});

        const hash= await bcrypt.hash(password,10);
        const user= await User.create({name,email,password:hash});
        
        //genrate token
        const token= GenerateJWT(user._id, user.email);
        res.status(200).json({id:user._id, name:user.name, email:user.email,token });

    }catch(err){
        console.error("Register Error: ",err)
        res.status(500).json({message:"Server Error", Error:err});
    }
}

async function Login(req,res) {
  try{
    const {email, password}= req.body;
    if ( !email || !password) return res.status(400).json({message:"missing fields"});

    const user= await User.findOne({email});
    if(!user) return res.status(400).json({message:"Invalid credentials"});

    const passwordIsmatch= await bcrypt.compare(password,user.password)
    if(!passwordIsmatch) return res.status(400).json({message:"password incorrect"})

    const token= GenerateJWT(user._id, user.email)
    res.status(200).json({id:user._id, name:user.name, email:user.email,token});

  }catch(err){
    console.error("Log in Error",err);
    res.status(500).json({message:"Server Error", Error:err})
  }
}

async function GetProfile(req,res) {
  try{
    const userId= req.user.id;
    if(!userId) return res.status(400).json({message:"User ID not found"});

    const user= await User.findById(userId).select("-password");
    if(!user) return res.status(404).json({message:"User not found"});

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      totalBudgets: user.budgets.length
    });

  }catch(err){
    console.error("Get Profile Error",err);
    res.status(500).json({message:"Server Error", Error:err})
  }
}

async function UpdateProfile(req,res) {
  try{
    console.log("UpdateProfile route called");
    console.log("User from middleware:", req.user);
    console.log("Request body:", req.body);
    
    const userId= req.user.id;
    const {name, password}= req.body;

    if(!userId) return res.status(400).json({message:"User ID not found"});

    // Validation
    if(!name || !name.trim()) return res.status(400).json({message:"Name cannot be empty"});

    const user= await User.findById(userId);
    if(!user) return res.status(404).json({message:"User not found"});

    // Update name
    user.name= name.trim();

    // Update password if provided
    if(password && password.length >= 8){
      const hash= await bcrypt.hash(password, 10);
      user.password= hash;
    } else if(password && password.length > 0){
      return res.status(400).json({message:"Password must be at least 8 characters long"});
    }

    await user.save();

    res.status(200).json({
      message:"Profile updated successfully",
      id: user._id,
      name: user.name,
      email: user.email
    });

  }catch(err){
    console.error("Update Profile Error",err);
    res.status(500).json({message:"Server Error", Error:err})
  }
}

module.exports={
    Register,
    Login,
    GetProfile,
    UpdateProfile
    
};