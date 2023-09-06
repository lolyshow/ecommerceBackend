const {default:mongoose} = require("mongoose")

const dbConnection =() =>{
    try{
        const con = mongoose.connect('mongodb://localhost:27017/')
        console.log("database connected successfully")
    }  
    catch(error){
        console.log("db Error")
    }
}

module.exports = dbConnection;