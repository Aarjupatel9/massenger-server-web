const express = require('express');
var cors = require("cors");
const bodyParser =  require("body-parser");
var urlencodedparser = bodyParser.urlencoded({ extended: false });
const authController = require("../controllers/auth");

const router = express.Router();
router.use(cors());

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

router.post("/updateUserProfileDetails", bodyParser.json(), (req, res) => {
  console.log("request arrive");
  console.log("username: ", req.body.urername);
  console.log("username: ", req.body.about);

  

});

module.exports = router;
