const express = require('express');
var mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = express();

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://root:1234@ds113746.mlab.com:13746/little-url');

var urlDir = mongoose.model('urlDirectory', {
    url : {
      type : String,
      required : true,
      minlength : 1
    },
    shortLink : {
      type : Number,
      default : null
    }
});

app.get('/', (req,res) => {
  res.send('Welcome to home page');
});

app.get('/new/:url', (req,res) => {
    var shortID = Math.floor(Math.random() * 10000);
    console.log(shortID);

    var shortUrl = new urlDir({
      url : req.params.url,
      shortLink : shortID
    });

    shortUrl.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      console.log(`Unable to save to db`);
    })
});

app.get('/:urlID',(req,res) => {
    urlDir.findOne({shortLink : req.params.urlID}).then((doc) => {
      if(!doc){
        return res.status(400).send();
      }else{
        res.redirect('https://' + doc.url);
      }
    }).catch((e) => {
      res.status(400).send();
    });
});

app.listen(port, () => {
  console.log(`Server is up on port : ${port}`);
});
