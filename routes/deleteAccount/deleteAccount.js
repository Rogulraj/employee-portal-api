const deleteRouter = require("express").Router();

const dbConnection = require("../../dbconnection/dbConnection");

const authentication = require("../../middlewares/deleteAccountMiddleware/deleteAccountMiddleware");

deleteRouter
  .route("/account/express")
  .delete(authentication, async (request, response) => {
    try {
      const { username } = request;
      console.log(username);
      const db = await dbConnection("employeeDB", "authenticationDetails");
      const deleteOperation = await db.findOneAndDelete({ username });
      response.status(200).json("Account Removed Successfully");
    } catch (error) {
      response.status(500).json("Internal Error");
    }
  });

module.exports = deleteRouter;
