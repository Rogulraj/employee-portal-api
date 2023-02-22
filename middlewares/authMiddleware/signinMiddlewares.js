const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const dbConnection = require("../../dbconnection/dbConnection");

const isPresentAllValues = async (request, response, next) => {
  try {
    const { username, password } = request.body;
    if (username === "") {
      response.status(400).json("username did not provided");
    } else if (password === "") {
      response.status(400).json("password did not provided");
    } else {
      next();
      return;
    }
  } catch (error) {
    response.status(500).json("Internal error");
  }
};

const validatingUserCrediential = async (request, response, next) => {
  const { username, password } = request.body;
  try {
    const db = await dbConnection("employeeDB", "authenticationDetails");
    const userDetails = await db.findOne({ username });

    if (userDetails === null) {
      response.status(400).json("User Does Not Exits In The Database!");
    } else {
      const isValidPassword = await bcrypt.compare(
        password,
        userDetails.password
      );

      if (isValidPassword === true) {
        return next();
      } else {
        response.status(400).json("Password Did Not Match!");
      }
    }
  } catch (error) {
    response.status(500).json("Internal Error");
  }
};

module.exports = { isPresentAllValues, validatingUserCrediential };
