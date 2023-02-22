const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

//Authentication:
const authentication = async (request, response, next) => {
  const authHeader = request.headers["authorization"];
  let jwtTokenVerify;
  if (authHeader !== undefined) {
    jwtTokenVerify = authHeader.split(" ")[1];
  }
  if (jwtTokenVerify === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(
      jwtTokenVerify,
      process.env.SECRET_KEY,
      async (error, payload) => {
        if (error) {
          response.status(400).json("Invalid JWT Token");
        } else {
          request.username = payload.username;
          next();
        }
      }
    );
  }
};

module.exports = authentication;
