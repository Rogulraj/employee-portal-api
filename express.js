const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const dbConnection = require("./dbconnection/dbConnection");

const app = express();

//cors-origin and body-parser-json middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

const authRouter = require("./routes/authUserDetails/authUserDetails");

const getRouter = require("./routes/getUserDetails/getUserDetails");

const deleteRouter = require("./routes/deleteAccount/deleteAccount");

app.use("/api/authentication", authRouter);

app.use("/api/get/", getRouter);

app.use("/api/delete", deleteRouter);

app.listen(3030, () => {
  console.log("Server at 3030");
});
