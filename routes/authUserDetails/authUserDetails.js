const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const dbConnection = require("../../dbconnection/dbConnection");

const authRouter = express.Router();

const {
  validatingCrediential,
  validateEmail,
  validateUsername,
  insertToDB,
  verificationMail,
} = require("../../middlewares/authMiddleware/signupMiddlewares");

const {
  isPresentAllValues,
  validatingUserCrediential,
} = require("../../middlewares/authMiddleware/signinMiddlewares");

authRouter
  .route("/signup/express")
  .post(
    validatingCrediential,
    validateEmail,
    validateUsername,
    insertToDB,
    verificationMail,
    async (request, response) => {
      try {
        response
          .status(200)
          .json("verification link sent to your mail address!");
      } catch (error) {
        console.log(error);
        response.status(500).json("Internal error");
      }
    }
  );

authRouter
  .route("/signin/express")
  .post(
    isPresentAllValues,
    validatingUserCrediential,
    async (request, response) => {
      const { username, password } = request.body;
      try {
        const payload = { username };
        const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);
        response.status(200).send({ jwt: jwtToken });
      } catch (error) {
        response.status(500).json("Internal Error");
      }
    }
  );

module.exports = authRouter;
