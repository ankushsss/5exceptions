require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb'); // include mongodb library 
const url = process.env.MONGOOSE;
 // Connection URL
 
const client = new MongoClient(url);
const multer = require('multer')
const fs = require('fs')
const app = express()
// --------------------------------------------------------
app.use(cors())//cross origin resource sharing
app.use(express.json())
client.connect().then(()=>{
  console.log('connected')
}).catch((err=>{
  console.log('error')
})); // Use connect method to connect to the server
// ------------------------------------------------------------------------------
const db = client.db('adminData');// database Name
collection = db.collection('itemList'); // users table name
imgcollection = db.collection('userImg');// usersDoc table name
chatcollection = db.collection('chat');// usersDoc table name
// ---------------------------------------------------------------------------------
var storage = multer.diskStorage({
  destination: './upload',
  filename: function (req, file, cb) {

    cb(null, Date.now() + ".." + file.originalname);
  }
});// for file upload destination path and name of file
var upload = multer({ storage });
//-----------------------------------------------------------------
app.use('/upload', express.static('upload'))
app.get('/upload/:imageName', (req, res) => {
  // do a bunch of if statements to make sure the user is 
  // authorized to view this image, then

  const imageName = req.params.imageName
  const readStream = fs.createReadStream(`upload/${imageName}`)
  readStream.pipe(res)
})

// user Registration 
app.post('/register',upload.single('file'), async function (req, res) {
    collection.insertOne({
      title: req.body.title,
      description: req.body.description,
      qty: req.body.qty,
      price: req.body.price,
      date:req.body.date,
      path:req.file.filename
      
    },
      function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  
})
app.post('/userList', (req, res) => {
  console.log(req.body.name)
  var name = new RegExp(req.body.name,"ig")

  let page = req.body.page - 1
  let limit = page * 10
  collection.find({"title" : name}).limit(10)
    .skip(limit)
    .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        collection.count().then((records)=>{
          console.log(result)
         res.json({
             records,
             result
         })
      })
      });

});
app.listen(process.env.PORT, () => {
  console.log(`listing the port at ${process.env.PORT}`);
})