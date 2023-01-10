const express = require("express");

const db = require("./database/db.js");
const dbManager = require("./database/db-manager.js");
const dbCollections = require("./database/collections.js");

// JWT
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv"); // to access .env file to load a secret password
// get config vars
dotenv.config();
// access config var
const JWT_SECRET = process.env.TOKEN_SECRET;

function generateToken(tokenContent) {
  return jwt.sign(tokenContent, JWT_SECRET, { expiresIn: "1d" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token, JWT_SECRET, (err, authData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    // save the user data in the req obj
    req.user = authData;
    next();
  });
}

const router = express.Router();


// TODO how can i restrict and make more secure my access policy?
//this permit to get a fetch from all the domain and port
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
})


// TODO GENERAL check that it dos not inject code in the api (attention to all the POST requests)

// TODO remove this, it is just an example to verify that an user is authenticated
router.get("/protected", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  res.json({
    message: "you are in a protected part of the site",
    userId: userId,
  });
});

// TODO remove this get, it is just a test to see if the server is still alive
router.get("/test", (req, res) => {
  console.log("Server is still alive");
  res.json({ message: "server is still alive working" });
});


router.get("/media", (req, res) => {
    res.send({message: "ok media"});
});

module.exports = router;
