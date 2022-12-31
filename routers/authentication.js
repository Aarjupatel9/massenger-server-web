const express = require('express');
var cors = require("cors");
const { MongoClient } = require("mongodb");
const bodyParser =  require("body-parser");
var urlencodedparser = bodyParser.urlencoded({ extended: false });
const authController = require("../controllers/auth");

const router = express.Router();
router.use(cors());

var mainDb;
var dbo;
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  mainDb = db;
  dbo = mainDb.db("massenger");
});

router.post("/signup", bodyParser.json(), authController.signup, (req, res) => {
  // console.log("signup request is arrive");
  // console.log(req.params);
  // res.send({ message: "ksdjfjf" });
});

router.post("/login", bodyParser.json(), authController.login, (req, re) => {
  // console.log(req.body.username)
});

router.get("/signup", (req, res) => {
  console.log("signup request is arrive");
  res.send("<h1>api/auth/signup request arrive</h1>");
});

router.post("/updateUserProfile", bodyParser.json(), async (req, res) => {
  console.log("request arrive");
  console.log("username: ", req.body.username);
  console.log("username: ", req.body.about);
  console.log("username: ", req.body.id);

  const condition = { id: req.body.id };
  const update = { username: req.body.username, about: req.body.about };
  const options = { upsert: true };
  const result = await dbo.collection("login_info").updateOne(condition, update, options);
  
  console.log("esult is :",result);

});

module.exports = router;
