const express = require("express");

const dbConnection = require("./config/dbConnection");
const app = express();
const dotenv = require("dotenv").config();
const PORT = 6000;
const authRouter = require("./routes/AuthRoutes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
dbConnection()

// app.use(morgan("dev"));
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use("/api/user", authRouter);


app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
  });