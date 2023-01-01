const express = require("express");
var cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
var urlencodedparser = bodyParser.urlencoded({ extended: false });
const authController = require("../controllers/auth");

const router = express.Router();
router.use(cors());

var url = "mongodb://localhost:27017/";
var mainDb;
var dbo;
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  mainDb = db;
  dbo = mainDb.db("massenger");
});

router.post("/signup", bodyParser.json(), authController.signup);
router.post("/login", bodyParser.json(), authController.login);

router.get("/signup", (req, res) => {
  console.log("signup request is arrive");
  res.send("<h1>api/auth/signup request arrive</h1>");
});

router.post("/updateUserProfile", bodyParser.json(), async (req, res) => {
  console.log("request arrive");
  console.log("username: ", req.body.username);
  console.log("username: ", req.body.about);
  console.log("username: ", req.body.id);

  const condition = { _id: ObjectId(req.body.id) };
  const update = {
    $set: { about: req.body.about, username: req.body.username },
  };
  const options = { upsert: false, multi: true };
  const result = await dbo
    .collection("login_info")
    .updateOne(condition, update, options);
  console.log("esult is :", result.modifiedCount);

  const data = {
    token: req.body.token,
    status: result.modifiedCount,
    mached: result.matchedCount,
  };
  res.send(data);
});

module.exports = router;
