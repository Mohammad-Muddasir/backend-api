const express = require('express')
const cors  = require('cors')
const multer = require('multer')
const mongoose = require('mongoose');
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser');
const app = express()
const Router=require('./routes/routes')
const port = 3001


app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('database is connected sucessfully');
});


app.use('',Router)











const store = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir('uploads/photos', { recursive: true}, function (err) {
      if (err) return cb(err);
      cb(null, 'uploads/photos');
    });
  },
  filename: function (req, file, cb) {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, name + '-' + Date.now());
  }
});
const upload = multer({ storage: store }).single('file');

function CreateUser(req, res) {
  const url = req.protocol + '://' + req.get("host");
  let user = new User(
      {
       image: url + '/uploads/photo/' + req.file.filename
      });
      console.log(req.file)
  user.save()
      .then(data => {
          res.send(data);
      }).catch(err => {
          res.status(500).send({
              success: false,
              message: err.message || "Some error occurred while creating the user."
          });
      });
};

///this api is used to
app.post('/create', [upload], CreateUser);


app.get('/getupload', (req, res) => {
  User.find({ })
    .then((data) => {
      res.send({ users: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Error retrieving users" });
    });
});



app.post('/users', (req, res) => {
  console.log("------>",req.body)
  res.send({message: req.body})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})