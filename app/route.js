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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

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

// API 1
// register a new user
// input e.g. {"username": "uniqueUsername", "email":"someemail@gmail.com", "password":"pass"}
router.post("/auth/signup", async (req, res) => {
  const mongo = db.getDb();
  const user = req.body;

  const nextUserID = await dbManager.getNextId(dbCollections.USERS);
  user.id = nextUserID;

  if (user.username === undefined || user.email === undefined || user.password === undefined) {
    return res.status(500).send({message : "you need to specify all the fields of a user: (username, email, password)"});
  }

  // check that the username is unique
  const userWithSameUsername = await mongo.collection(dbCollections.USERS).findOne({username: user.username});
  if(userWithSameUsername){
    // it already exist an user with that username 
    return res.status(500).send({message: "an user with username: "+userWithSameUsername.username +" already exist"});
  }

  const result = await mongo.collection(dbCollections.USERS).insertOne(user);
  res.json(result);

});

// API 2 : OK
// login of a user
// when a user sign in I give him a JWT token
// e.g of an input: {"email" : "myEmail@gmail.com", "password" : "myPassword"}
router.post("/auth/signin", async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  const mongo = db.getDb();

  const postedUser = ({ email, password } = req.body);

  const user = await mongo.collection(dbCollections.USERS).findOne(postedUser);

  if (!user) {
    // User not found: (email + password) does not match
    res.status(400).send({ message: "User not found" });
  } else {
    const token = generateToken({ id: user.id });
    res.send({token, userId:user.id});
  }
});

// API 3
// if the user is authenticated return the user info
router.get("/social/whoami", authenticateToken, async (req, res) => {
  const mongo = db.getDb();

  const userId = req.user.id;

  const user = await mongo
    .collection(dbCollections.USERS)
    .findOne({ id: userId });

  res.json(user);
});


// API 4
// get the contents in the DB
router.get("/contents", async (req, res) => {
  const mongo = db.getDb();

  const contents = await mongo
    .collection(dbCollections.CONTENTS)
    .find()//.limit(10) // add this if you want to limit the response
    .toArray();
    

  res.json(contents);
});


//API 5
router.post("/social/like/:id", authenticateToken, async (req, res) => {  
  const contentID = req.params.id;

  const mongo = db.getDb();

  const content = await mongo.collection(dbCollections.CONTENTS).findOne({id: contentID}); 

  // TODO check that the user not already put a like to this content previously

  res.send({content});
});


module.exports = router;
