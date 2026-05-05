const express= require("express")
const {Register,Login,GetProfile,UpdateProfile}=require("../controller/UserController")
const authMiddleware= require("../auth/AuthMiddleWare")

const router= express.Router();

console.log("UserRoute loaded - UpdateProfile function:", typeof UpdateProfile);

//register user : api/user/register
router.post("/register", Register)


//login user : api/user/login
router.post("/login",Login)

//get user profile : api/user/profile
router.get("/profile", authMiddleware, GetProfile)

//update user profile : api/user/profile
router.put("/profile", authMiddleware, UpdateProfile)

console.log("User routes registered");

module.exports= router;