const express = require("express");
const cors = require('cors');
const dbConnection = require("./config/dbConnection");
const app = express();
const dotenv = require("dotenv").config();
const PORT = 5001;
const authRouter = require("./routes/AuthRoutes");
const ProductRouter = require("./routes/ProductRoutes");
const blogRouter = require("./routes/blogRoutes");
const CategoryRoute = require("./routes/CategoryRoute");
const uploadRoute = require("./routes/uploadRoute");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
dbConnection()

// app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use("/api/user", authRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", ProductRouter);
app.use("/api/blog", blogRouter);
app.use("/api/Category", CategoryRoute);
app.use("/api/upload", uploadRoute);


app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
  });