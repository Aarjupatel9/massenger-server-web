const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

var url = "mongodb://localhost:27017/";

var mainDb;
var dbo;
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  mainDb = db;
  dbo = mainDb.db("massenger");
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, " and  ", password);
    if (!email || !password) {
      return res.status(500).send({ status: 5 });
    }
    var query = { email: email };
    dbo
      .collection("login_info")
      .find(query)
      .toArray(function (err, result) {
        if (err) {
          throw err;
        }
        if (result[0]) {
          // console.log(result[0]._id);

          bcrypt.compare(password, result[0].password).then((e) => {
            console.log("password is ", password);
            console.log("password is ", result[0].password);
            console.log("login successful : ", e);
            if (e) {
              const user_key = result[0]._id;
              const token = jwt.sign({ user_key }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
              });
              console.log("The token is: " + token);
              const cookieOptions = {
                expires: new Date(
                  Date.now() +
                    process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                secure: false,
              };
              res.cookie("jwt", token, cookieOptions);
              res.status(200).send({ status: 1, token });
              return;
            } else {
              res.status(200).send({ status: 2 });
              return;
            }
          });
        } else {
          res.status(200).send({ status: 0 });
          return;
        }
      });
  } catch (error) {
    console.log("error is : ", error);
    res.status(500).send({ status: 0 });
    return;
  }
};

exports.signup = async (req, res) => {
  // console.log(req.body);
  const { username, email, password } = req.body;

  var query = { email: email };
  dbo
    .collection("login_info")
    .find(query)
    .toArray(async function (err, result) {
      if (err) {
        throw err;
      }
      if (result.length > 0) {
        // console.log(result[0]._id);
        return res.send({ status: 0 });
      } else {
        var hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        var myobj = {
          username: username,
          email: email,
          password: hashedPassword,
          originalPassword: password,
        };

        dbo.collection("login_info").insertOne(myobj, function (err, result) {
          if (err) {
            console.log("error:", err);
          } else {
            console.log("Number of document inserted: " + result.insertedId);
            // console.log(result);
            res.status(200).send({ status: 1, insertedId: res.insertedId });
            return;
          }
        });
      }
    });
};

// exports.isLoggedIn = async (req, res, next) => {
//   // console.log(req.cookies);
//   if (req.cookies.jwt) {
//     try {
//       //1) verify the token
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         process.env.JWT_SECRET
//       );
//       // console.log(decoded);
//       //2) Check if the user still exists
//       con.query(
//         "SELECT * FROM users_details WHERE user_key = ?",
//         [decoded.user_key],
//         (error, result) => {
//           // console.log(result);
//           if (!result) {
//             req.isloggedin = 2;
//             console.log("enter in not result");
//             return next();
//           }

//           req.user = result[0];
//           // console.log("user is", req.user);
//           console.log("user is", decoded.user_key);
//           if (decoded.user_key) {
//             console.log("enter in exist login condition");
//             req.isloggedin = 1;
//             req.user_key = decoded.user_key;
//             return next();
//           } else {
//             req.isloggedin = 0;
//             res.redirect("/login");
//             console.log("enter in undefined userkey cndition ");
//             //  res.redirect("/login");
//             var data = [];
//             data["message"] = 4;
//             res.render("auth/login.ejs", { data });
//           }
//         }
//       );
//     } catch (error) {
//       req.isloggedin = 0;
//       console.log("enter in catch error ");
//       // console.log(error);
//       var data = [];
//       data["message"] = 4;
//       res.render("auth/login.ejs", { data });
//     }
//   } else {
//     console.log("enter in cookiei not set  condition ");
//     req.isloggedin = 0;
//     var data = [];
//     data["message"] = "4";
//     res.render("auth/login.ejs", { data });
//   }
// };

// exports.logout = async (req, res) => {
//   res.cookie("jwt", "logout", {
//     expires: new Date(Date.now()), //Date.now()+ 2 * 1000// some jwt error in this
//     httpOnly: true,
//   });
//   res.status(200).redirect("/");
// };
