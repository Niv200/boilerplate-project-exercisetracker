const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const User = require("./models/user");

mongoose
  .connect(
    "mongodb+srv://niv-database01:nivsdata@cluster0.cdi79.mongodb.net/exerciseTracker?retryWrites=true&w=majority",
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected Successfully to Mongoose atlas"));

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/exercise/new-user", async (req, res) => {
  const body = req.body;
  const userName = body.username;
  const user = await User.find({ userName: userName });
  if (user[0] === undefined) {
    const newUser = new User({
      userName: userName,
    });
    await newUser.save();
    const id = newUser._id;
    const obj = {
      username: newUser.userName,
      _id: id,
    };
    res.json(obj);
  } else {
    res.status(400).send("Username already taken");
  }
});


app.get("/api/exercise/users", async (req, res) =>{
const userArray = await User.find({});
res.json(userArray);
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
