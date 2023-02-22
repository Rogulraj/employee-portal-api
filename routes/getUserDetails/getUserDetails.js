const getRouter = require("express").Router();

const dbConnection = require("../../dbconnection/dbConnection");

const authentication = require("../../middlewares/getUserMiddleware/getUserMiddleware");

getRouter
  .route("/specific-user/express")
  .get(authentication, async (request, response) => {
    const { username } = request;
    try {
      const db = await dbConnection("employeeDB", "authenticationDetails");
      const userDetails = await db.findOne({ username });
      const sendDetails = {
        username: userDetails.username,
        email: userDetails.email,
        companyName: userDetails.companyName,
        dob: userDetails.dob,
        age: userDetails.age,
        createdAt: userDetails.created_at,
      };
      response.status(200).send(sendDetails);
    } catch (error) {
      response.status(500).json("Internal Error");
    }
  });

module.exports = getRouter;
