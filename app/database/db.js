const { MongoClient } = require("mongodb");

const url = "mongodb://mongohost";

const client = new MongoClient(url);

let _db;

let database = {
  connect: async () => {
    await client.connect();
    _db = client.db("redbullDB");
  },
  getDb: () => _db
};


module.exports = database;
// TODO when return is better to check if the db is still connected
