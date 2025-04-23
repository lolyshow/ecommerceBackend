const User  = require("../models/UserModel")

const jwt = require("jsonwebtoken")

const asyncHandler = require("express-async-handler")

const authMiddleware = asyncHandler(async (req, res, next) =>{
    let token
    if(token = req.headers?.authorization?.startsWith("Bearer")){
        token = req.headers?.authorization?.split(" ")[1];
        try{
            if(token){
                const decoded = jwt.verify(token,process.env.JWT_SECRET)
                const user = await User.findById(decoded?.id)
                req.user = user;
                next();

            }
        }
        catch(error){
            res.status(500).json({ status:401, message: "Not Authorized token expired, Please login again!" });
            // throw new Error("Not Authorized token expired, Please login again!")
        }
    }else{
        throw new Error("Please pass token")
    }
})

const isAdmin = asyncHandler(async (req,res, next)=>{
    const {email} = req.user

    const adminUser = await User.findOne({email})
    if(adminUser.role !== "admin"){
        throw new Error("Sorry!!! you are not allowed to visit this page")
    }
    else{
        next();
    }
})
module.exports = {authMiddleware,isAdmin}