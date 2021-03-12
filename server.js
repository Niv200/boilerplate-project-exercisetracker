const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const User = require("./models/user");
const Exercise = require("./models/exercise");
const { response } = require('express');

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
  const user = await User.find({ username: userName });
  if (user[0] === undefined) {
    const newUser = new User({
      username: userName,
    });
    await newUser.save();
    const id = newUser._id;
    const obj = {
      username: newUser.username,
      _id: id,
    };
    res.json(obj);
  } else {
    res.status(400).send("Username already taken");
  }
});

app.post("/api/exercise/add", async (req, res) =>{
  const body = req.body;
  console.log(body);
  let obj = {
    description: body.description,
    duration: parseInt(body.duration),
    date: body.date
  };
  if(obj.date === ''){
    obj.date = new Date().toISOString().substring(0, 10);
  }
  let exercise = new Exercise(obj);

  const user = await User.findByIdAndUpdate(body.id,
    {$push : {log: exercise}},
    {new: true}, //Meaning itll return the new exercise and not the old.
    (error, newUser) =>{

    });
  res.json(exercise);
});

// app.post("/api/exercise/add", async (req, res) =>{
//   const body = req.body;
//   let exercise;
//   if(!body.date){
//      exercise = new Exercise({
//     userId: body.userId,
//     description: body.description,
//     duration: body.duration,
//   });
//   }else{
//    exercise = new Exercise({
//     userId: body.userId,
//     description: body.description,
//     duration: body.duration,
//     date: body.date
//   });
// }
//   await exercise.save();
//   const obj = {};
//   const id = exercise._id;
//   const {username} = await Exercise.findById(id);
//   obj._id = id;
//   obj.username = username;
//   obj.date = exercise.date;
//   obj.duration = exercise.duration;
//   res.json(obj);
// });

app.get("/api/exercise/users", async (req, res) =>{
const userArray = await User.find({});
res.json(userArray);
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
