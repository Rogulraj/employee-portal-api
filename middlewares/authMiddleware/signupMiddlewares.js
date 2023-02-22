const dbConnection = require("../../dbconnection/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

//signup middlewares
const validatingCrediential = async (request, response, next) => {
  try {
    const { email, username, companyName, dob, age, password } = request.body;
    if (email === "") {
      response.status(400).json("email did not provided");
    } else if (username === "") {
      response.status(400).json("username did not provided");
    } else if (companyName === "") {
      response.status(400).json("company name did not provided");
    } else if (dob === "") {
      response.status(400).json("date of birth did not provided");
    } else if (age === "") {
      response.status(400).json("age did not provided");
    } else if (age < 18) {
      response
        .status(400)
        .json("due to age restriction we cannot process further your request");
    } else if (password === "") {
      response.status(400).json("password did not provided");
    } else {
      next();
      return;
    }
  } catch (error) {
    console.log(error);
    response.status(500).json("Internal error");
  }
};

const validateEmail = async (request, response, next) => {
  const { email } = request.body;
  try {
    const db = await dbConnection("employeeDB", "authenticationDetails");
    const isPresent = await db.findOne({ email });
    if (isPresent !== null) {
      response.status(400).json("email id already exists");
    } else {
      next();
      return;
    }
  } catch (error) {
    console.log(error);
    response.status(500).json("Internal error");
  }
};

const validateUsername = async (request, response, next) => {
  const { username } = request.body;
  try {
    const db = await dbConnection("employeeDB", "authenticationDetails");
    const isPresent = await db.findOne({ username });
    if (isPresent !== null) {
      response.status(400).json("username already exists");
    } else {
      return next();
    }
  } catch (error) {
    console.log(error);
    response.status(500).json("Internal error");
  }
};

const insertToDB = async (request, response, next) => {
  try {
    const db = await dbConnection("employeeDB", "authenticationDetails");
    const { email, username, companyName, dob, age, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertDetails = {
      email,
      username,
      companyName,
      dob,
      age,
      password: hashedPassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const insertStatus = await db.insertOne(insertDetails);
    if (insertStatus.acknowledged) {
      return next();
    } else {
      response.status(400).json(`${username} not inserted to database`);
    }
  } catch (error) {
    console.log(error);
    response.status(500).json("Internal error");
  }
};

const verificationMail = async (request, response, next) => {
  try {
    const { email } = request.body;
    const transpoter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "verifyuserdetails@gmail.com",
        pass: process.env.NODE_MAILER_PASS,
      },
    });

    const mailOption = {
      from: "verifyuserdetails@gmail.com",
      to: email,
      subject: "Please verify your account",
      text: "we are very happy to see you in our team, click the link and login to your account LINK - http://localhost:3004/verify-user",
    };

    transpoter.sendMail(mailOption, async (error, info) => {
      if (error) {
        const db = await dbConnection("employeeDB", "authenticationDetails");
        const { email } = request.body;
        const deleteResult = await db.findOneAndDelete({
          email,
        });
        response
          .status(500)
          .json("internal error, make sure nodemailer authentication");
      } else {
        return next();
      }
    });
  } catch (error) {
    console.log(error);
    response.status(500).json("Internal error");
  }
};

module.exports = {
  validatingCrediential,
  validateEmail,
  validateUsername,
  insertToDB,
  verificationMail,
};
