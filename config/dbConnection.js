const {default:mongoose} = require("mongoose")

const dbConnection =() =>{
    try{
        const con = mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected successfully")
    }  
    catch(error){
        console.log("db Error")
    }
}

module.exports = dbConnection;