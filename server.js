const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
// app.use(bodyParser.json())
app.use("/api/auth", require("./routers/authentication"));

const port = 10001;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

app.get("/", (req, res) => {
  console.log("enter in /");
    res.send({ name: "mhk" });
});

// app.post();
