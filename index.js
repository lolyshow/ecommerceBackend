const express = require("express");
const dbConnection = require("./config/dbConnection");
const app = express();
const dotenv = require("dotenv").config();
const PORT = 5000;
dbConnection()
app.use("/", (req, res)=>{
    res.send("Helllo from the other side!!!")
})

app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
  });