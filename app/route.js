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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
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

  if (user.username === undefined || user.email === undefined || user.password === undefined || user.username === '' || user.email === '' || user.password === '') {
    return res.status(500).send({message : "You need to specify all the fields of a user: (username, email, password)"});
  }

  // check that the username is unique
  const userWithSameUsername = await mongo.collection(dbCollections.USERS).findOne({username: user.username});
  if(userWithSameUsername){
    // it already exist an user with that username 
    return res.status(500).send({message: "Username: "+userWithSameUsername.username +" already exist, choose another one!"});
  }

  // check that the email is unique
  const userWithSameEmail = await mongo.collection(dbCollections.USERS).findOne({email: user.email});
  if(userWithSameEmail){
    // it already exist an user with that email 
    return res.status(500).send({message: "It already exist a register user with this email: "+userWithSameEmail.email});
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
// add a like to the content with the given id
router.post("/social/like/:id", authenticateToken, async (req, res) => {
  const userID = req.user.id;
  const contentID = req.params.id;

  const mongo = db.getDb();

  const content = await mongo.collection(dbCollections.CONTENTS).findOne({id: contentID}); 

  if(content.likes === undefined){
    content.likes = [];
  }


  if(content.likes.includes(userID)){
    // the user with userID has already put a like to this content previously
    return res.send({message: "you already put a like to this content previously", error: true});
  }

  const result = await mongo.collection(dbCollections.CONTENTS).updateOne({id: contentID}, {$push: {likes: userID}}); 

  res.send({result});
});

//API 6
// remove a like to the content with the given id
router.delete("/social/like/:id", authenticateToken, async (req, res) => {
  const userID = req.user.id;
  const contentID = req.params.id;

  const mongo = db.getDb();


  const content = await mongo.collection(dbCollections.CONTENTS).findOne({id: contentID}); 

  if(content.likes === undefined){
    return res.send({message: `user with id ${userID} do no has a like to this content to remove`});
  }

  if(content.likes.includes(userID)){
    // the user with this userID has a like to this content (put previously)
    const result = await mongo.collection(dbCollections.CONTENTS).updateOne({id: contentID}, {$pull: {likes: userID}}); 
    res.send({result});

  }else{
    return res.send({message: `user with id ${userID} do no has a like to this content to remove`});
  }

});


//API 7
// add a dislike to the content with the given id
router.post("/social/dislike/:id", authenticateToken, async (req, res) => {
  const userID = req.user.id;
  const contentID = req.params.id;

  const mongo = db.getDb();

  const content = await mongo.collection(dbCollections.CONTENTS).findOne({id: contentID}); 

  if(content.dislikes === undefined){
    content.dislikes = [];
  }

  if(content.dislikes.includes(userID)){
    // the user with userID has already put a dislike to this content previously
    return res.send({message: "you already put a dislike to this content previously", error: true});
  }

  const result = await mongo.collection(dbCollections.CONTENTS).updateOne({id: contentID}, {$push: {dislikes: userID}}); 

  res.send({result});
});

//API 8
// remove a dislike to the content with the given id
router.delete("/social/dislike/:id", authenticateToken, async (req, res) => {
  const userID = req.user.id;
  const contentID = req.params.id;

  const mongo = db.getDb();

  const content = await mongo.collection(dbCollections.CONTENTS).findOne({id: contentID}); 

  if(content.dislikes === undefined){
    return res.send({message: `user with id ${userID} do no has a dislike to this content to remove`});
  }

  if(content.dislikes.includes(userID)){
    // the user with this userID has a dislike to this content (put previously)
    const result = await mongo.collection(dbCollections.CONTENTS).updateOne({id: contentID}, {$pull: {dislikes: userID}}); 
    res.send({result});

  }else{
    return res.send({message: `user with id ${userID} do no has a dislike to this content to remove`});
  }

});



// API 9
// get the top 10 content with most likes
router.get("/trend", async (req, res) => {
  const mongo = db.getDb();

  const contents = await mongo
    .collection(dbCollections.CONTENTS)
    .aggregate([{
      $addFields: { likes_number: {$size: { "$ifNull": [ "$likes", [] ] } } }
    },{
      $sort: {"likes_number":-1} 
    }])
    .limit(10)
    .toArray();
    
  res.json(contents);
});




module.exports = router;
