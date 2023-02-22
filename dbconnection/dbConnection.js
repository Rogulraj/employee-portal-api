const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();

const dbConnection = async (dbName, collectionName) => {
  const url = process.env.MONGODB_URL;
  const client = await new MongoClient(url).connect();

  const dbCollection = client.db(dbName).collection(collectionName);
  return dbCollection;
};

module.exports = dbConnection;
